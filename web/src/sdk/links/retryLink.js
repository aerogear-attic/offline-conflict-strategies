import {RetryLink} from "apollo-link-retry";

export const retryOnErrorLink = (numOfAttempts, firstAttempAfter) => (
  new RetryLink({
    delay: {initial: firstAttempAfter || 1000},
    attempts: (count, operation, error) => {
      console.log(`retryOnErrorLink: {      
        numOfAttempts: ${count}, 
        firstAttempAfter: ${firstAttempAfter},
        count: ${count},
        operation: ${operation},
        error: ${error}
      }`);
      return (count <= numOfAttempts || 5);
    }
  })
);
