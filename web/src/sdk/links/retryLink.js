import {RetryLink} from "apollo-link-retry";
import { getOperationDefinition } from "apollo-utilities";

export const retryOnErrorLink = (numOfAttempts, firstAttempAfter) => (
  new RetryLink({
    delay: {initial: firstAttempAfter || 1000},
    attempts: (count, operation, error) => {
      const { operation: operationType } = getOperationDefinition(operation.query);
      const isMutation = operationType === 'mutation';
      console.info(`retryOnErrorLink: {      
        numOfAttempts: ${count}, 
        firstAttempAfter: ${firstAttempAfter},
        count: ${count},
        operation: ${operationType},
        error: ${error}
      }`);
      return (isMutation && (count <= numOfAttempts || 5));
    }
  })
);
