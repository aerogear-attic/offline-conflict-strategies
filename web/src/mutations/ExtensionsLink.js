import { ApolloLink, Observable } from 'apollo-link'

export class ExtensionsLink extends ApolloLink {
    constructor({ storage } = {}) {
        super()
    }

    request = (operation, forward) => {
        if (!operation.extensions) {
            operation.extensions = {
                version: 1
            }
        } else {
            operation.extensions.version = 1;
        }
        console.log(operation)
        return forward(operation);
    }
}
