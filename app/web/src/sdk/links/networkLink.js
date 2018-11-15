import {onError} from 'apollo-link-error'
import { logger } from "../logger"

export const networkLink = () => (
  onError(({graphQLErrors, networkError, operation, forward}) => {
    if (networkError) {
      logger(`[Network error]: ${networkError}`);
    }
  })
);
