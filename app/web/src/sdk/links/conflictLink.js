import { onError } from 'apollo-link-error'
import strategies from './strategies'
import { logger} from "../logger"
export const conflictLink = () => (
  onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions && err.extensions.exception) {
          if (err.extensions.exception.type === 'AgSync:DataConflict') {
            const serverData = err.extensions.exception.data;
            const clientData = operation.variables;
            let mergedVariables = strategies.diffMergeClientWins(serverData, clientData)
            mergedVariables.version = err.extensions.exception.data.version
            operation.variables = mergedVariables
            logger(`Conflict happened`, operation, err.extensions.exception.data)
            forward(operation)
          }
        }
      }
    }
  })
);
