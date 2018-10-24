import {onError} from 'apollo-link-error'

export const conflictLink = () => (
  onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if(err.extensions && err.extensions.exception){
          switch (err.extensions.exception.type) {
            case 'AgSync:DataConflict':
              console.log(`Conflict happened`, operation, err.extensions.exception.data)
          }
        }
      }
    }
  })
);
