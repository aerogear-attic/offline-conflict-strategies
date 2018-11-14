import { createClient, strategies } from '@aerogear/datasync-js'
export const setupApolloClient = async () => {

  // Local server
  const uri = `http://localhost:4000/graphql`
  const wsUri = `ws://localhost:4000/graphql`
  return await createClient({ httpUrl: uri, wsUrl: wsUri, conflictStrategy: strategies.diffMergeClientWins })

}
