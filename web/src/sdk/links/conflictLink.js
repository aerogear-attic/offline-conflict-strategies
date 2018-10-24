import {onError} from 'apollo-link-error'
import merge from "deepmerge";

export const conflictLink = () => (
  onError(({graphQLErrors, networkError, operation, forward}) => {
    debugger
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if(err.extensions && err.extensions.exception){
          switch (err.extensions.exception.type) {
            case 'AgSync:DataConflict':
              let newVersion = err.extensions.exception.data.version+1
              let mergedVariables = merge(err.extensions.exception.data, operation.variables)
              mergedVariables.version = newVersion
              operation.variables= mergedVariables
              console.log(`Conflict happened`, operation, err.extensions.exception.data)
              forward(operation)
          }
        }
      }
    }
  })
);
