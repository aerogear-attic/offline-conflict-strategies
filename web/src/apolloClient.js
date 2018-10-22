//import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'

import ApolloClient from "apollo-boost";

// We may use Apollo Boost at later stage to replace this setup

export const setupApolloClient = async () => {
  const uri = `https://api.graph.cool/simple/v1/cjmltohxn3phc0173w5w6p659`
 
  const cache = new InMemoryCache()

  const client = new ApolloClient({
    cache: cache,
    uri: uri
  });

  await persistCache({
    cache,
    storage: window.localStorage,
  })

  return client
}
