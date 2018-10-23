import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist'
import { onError } from 'apollo-link-error'

// We may use Apollo Boost at later stage to replace this setup

import { QueueMutationLink } from '../sdk/mutations/QueueMutationLink'
import { SyncOfflineMutation } from '../sdk/mutations/SyncOfflineMutation'

export const setupApolloClient = async () => {
  const storage = window.localStorage
  // Local server
  const uri = `http://localhost:4000/graphql`
  // Graph.cool for testing
  //const uri = `https://api.graph.cool/simple/v1/cjmltohxn3phc0173w5w6p659`
  const httpLink = new HttpLink({ uri })
  const conflictHandler = (operation, data) => {
    console.log(`Conflict happened`, operation, data)
  }
  const conflictLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.exception.type) {
          case 'AgSync:DataConflict':
            conflictHandler(operation, err.extensions.exception.data)
        }
      }
    }
  }
  );

  const networkErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      // TODO check if mutation
      // Use Apollo-link-Retry?
      // Save to storage if number of retries failed?
      // Write your own retry logic?
      console.log(`[Network error]: ${networkError}`);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  });

  const offlineLink = new QueueMutationLink({ storage })
  const cache = new InMemoryCache()

  let link = ApolloLink.from([offlineLink, conflictLink, networkErrorLink, httpLink])

  const apolloClient = new ApolloClient({ link, cache })
  await persistCache({
    cache,
    storage: window.localStorage,
  })

  window.addEventListener('online', () => offlineLink.open({ apolloClient }))
  window.addEventListener('offline', () => offlineLink.close())


  const syncOfflineMutation = new SyncOfflineMutation({ apolloClient, storage })
  await syncOfflineMutation.init()
  await syncOfflineMutation.sync()


  return apolloClient

}
