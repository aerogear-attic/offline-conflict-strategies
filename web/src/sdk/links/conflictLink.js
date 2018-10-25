import { onError } from 'apollo-link-error'
import strategies from './strategies'

export const conflictLink = () => (
  onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions && err.extensions.exception) {
          switch (err.extensions.exception.type) {
            case 'AgSync:DataConflict':
              const serverData = err.extensions.exception.data;
              const clientData = operation.variables;
              let mergedVariables = strategies.diffMergeClientWins(serverData, clientData)
              mergedVariables.version = err.extensions.exception.data.version
              operation.variables = mergedVariables
              console.log(`Conflict happened`, operation, err.extensions.exception.data)
              forward(operation)
          }
        }
      }
    }
  })
);
