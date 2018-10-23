import {RetryLink} from "apollo-link-retry";

export const retryOnErrorLink = ({numOfAttempts = 5, firstAttempAfter = 1000}) => (
  new RetryLink({
    delay: {initial: firstAttempAfter},
    attempts: (count, operation, error) => {
      console.log(`retryOnErrorLink: {      
        numOfAttempts: ${count}, 
        firstAttempAfter: ${firstAttempAfter},
        count: ${count},
        operation: ${operation},
        error: ${error}
      }`);
      return (count <= numOfAttempts);
    }
  })
);
