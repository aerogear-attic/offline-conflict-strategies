import { ApolloLink, Observable } from 'apollo-link'

export class ExtensionsLink extends ApolloLink {
    constructor({ storage } = {}) {
        super()
    }

    request = (operation, forward) => {
        if (!operation.extensions) {
            operation.extensions = {
                test: "test"
            }
        } else {
            operation.extensions.test = "test";
        }
        console.log(operation)
        return forward(operation);
    }
}
