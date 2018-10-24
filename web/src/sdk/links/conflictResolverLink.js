import {RetryLink} from "apollo-link-retry";
import { getOperationDefinition } from "apollo-utilities";

export const retryOnConflictLink = (numOfAttempts, firstAttemptAfter) => (
  new RetryLink({
    delay: {initial: firstAttemptAfter || 1000},
    attempts: (count, operation, error) => {
      const { operation: operationType } = getOperationDefinition(operation.query);
      const isMutation = operationType === 'mutation';
      console.info(`retryOnConflictLink: {
        numOfAttempts: ${count},
        firstAttemptAfter: ${firstAttemptAfter},
        count: ${count},
        operation: ${operationType},
        error: ${error}
      }`);
      return (isMutation && (count <= numOfAttempts || 5));
    }
  })
);
