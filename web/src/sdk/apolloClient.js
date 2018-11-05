import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, split } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist'
import { conflictLink, networkLink, retryOnErrorLink, webSocketLink } from './links'
import { getMainDefinition } from 'apollo-utilities';

// We may use Apollo Boost at later stage to replace this setup

import { QueueMutationLink } from '../sdk/mutations/QueueMutationLink'
import { SyncOfflineMutation } from '../sdk/mutations/SyncOfflineMutation'

export const setupApolloClient = async () => {
  const storage = window.localStorage

  // Local server
  const uri = `http://localhost:4000/graphql`
  const wsUri = `ws://localhost:4000/graphql`
  // Graph.cool for testing
  // const uri = `https://api.graph.cool/simple/v1/cjmltohxn3phc0173w5w6p659`
  // const wsUri = `wss://subscriptions.graph.cool/v1/cjmltohxn3phc0173w5w6p659`

  const offlineLink = new QueueMutationLink({ storage })
  const httpLink = new HttpLink({ uri })

  const requestLink = ApolloLink.from([offlineLink, conflictLink(), networkLink(), retryOnErrorLink(), httpLink])
  const wsLink = webSocketLink(wsUri, {
    connectionCallback: (error) => {
      if (error) {
        console.log("Error on ws connection", error)
      } else {
        console.log("Successfully connected to ws")
      }
    }
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    requestLink
  );

  const cache = new InMemoryCache({
    // Use id as object for cache
    dataIdFromObject: object => object.id
  });
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
