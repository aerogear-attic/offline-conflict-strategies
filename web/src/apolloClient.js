import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist'
import { onError } from 'apollo-link-error'

// We may use Apollo Boost at later stage to replace this setup

import { QueueMutationLink } from './mutations/QueueMutationLink'
import { SyncOfflineMutation } from './mutations/SyncOfflineMutation'

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
  const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.exception.type) {
          case 'AgSync:DataConflict':
            conflictHandler(operation, err.extensions.exception.data)
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // TODO PASSOS :P
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
  );

  const queueLink = new QueueMutationLink({ storage })
  const cache = new InMemoryCache()

  let link = ApolloLink.from([queueLink, onErrorLink, httpLink])

  const apolloClient = new ApolloClient({ link, cache })
  await persistCache({
    cache,
    storage: window.localStorage,
  })

  window.addEventListener('online', () => queueLink.open({ apolloClient }))
  window.addEventListener('offline', () => queueLink.close())


  const syncOfflineMutation = new SyncOfflineMutation({ apolloClient, storage })
  await syncOfflineMutation.init()
  await syncOfflineMutation.sync()


  return apolloClient

}
