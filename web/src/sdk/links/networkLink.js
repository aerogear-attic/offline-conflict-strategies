import {
    onError
} from 'apollo-link-error'

export class NetworkLink {
    constructor() {
        this.link = onError(({
            graphQLErrors,
            networkError,
            operation,
            forward
        }) => {
            if (networkError) {
                // TODO check if mutation
                // Use Apollo-link-Retry?
                // Save to storage if number of retries failed?
                // Write your own retry logic?
                console.log(`[Network error]: ${networkError}`);
                // if you would also like to retry automatically on
                // network errors, we recommend that you use
                // apollo-link-retry
            }
        });
    }
}