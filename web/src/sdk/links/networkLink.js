import {onError} from 'apollo-link-error'

export const networkLink = () => (
  onError(({graphQLErrors, networkError, operation, forward}) => {
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  })
);
