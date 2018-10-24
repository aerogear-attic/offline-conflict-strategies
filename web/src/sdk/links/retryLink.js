import {RetryLink} from "apollo-link-retry";
import { getOperationDefinition } from "apollo-utilities";

export const retryOnErrorLink = (numOfAttempts = 5, firstAttempAfter = 2000) => (
  new RetryLink({

    delay: {initial: firstAttempAfter, jitter: false},
    attempts: (count, operation, error) => {
      const { operation: operationType } = getOperationDefinition(operation.query);
      const isMutation = operationType === 'mutation';
      console.info(`retryOnErrorLink: {
        firedAt: ${new Date()},      
        numOfAttempts: ${numOfAttempts}, 
        firstAttempAfter: ${firstAttempAfter},
        count: ${count},
        operation: ${operationType},
        error: ${error}
      }`);
      return (isMutation && (count <= numOfAttempts));
    }
  })
);
