import {onError} from 'apollo-link-error'
import diffMergeClientWins from "deepmerge";

export const conflictLink = () => (
  onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if(err.extensions && err.extensions.exception){
          switch (err.extensions.exception.type) {
            case 'AgSync:DataConflict':
              let mergedVariables = diffMergeClientWins(err.extensions.exception.data, operation.variables)
              mergedVariables.version = err.extensions.exception.data.version
              operation.variables= mergedVariables
              console.log(`Conflict happened`, operation, err.extensions.exception.data)
              forward(operation)
          }
        }
      }
    }
  })
);
