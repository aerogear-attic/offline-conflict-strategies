import {
    onError
} from 'apollo-link-error'

export class ConflictLink {
    constructor() {
        this.link = onError(({
            graphQLErrors,
            networkError,
            operation,
            forward
        }) => {
            if (graphQLErrors) {
                for (let err of graphQLErrors) {
                    switch (err.extensions.exception.type) {
                        case 'AgSync:DataConflict':
                            this.conflictHandler(operation, err.extensions.exception.data)
                    }
                }
            }
        })
    }
    conflictHandler = (operation, data) => {
        console.log(`Conflict happened`, operation, data)
    }
}