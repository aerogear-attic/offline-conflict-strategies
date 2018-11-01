import {ApolloLink, Observable} from 'apollo-link'
import {SyncOfflineMutation} from './SyncOfflineMutation'
import deepmerge from 'deepmerge'

export class QueueMutationLink extends ApolloLink {
  constructor({storage} = {}) {
    super()

    if (!storage) throw new Error('Storage can be window.localStorage or AsyncStorage but was not set')
    this.storage = storage
    this.storeKey = 'offline-mutation-store'
    this.queue = []
    this.isOpen = true
  }

  resync = async ({apolloClient, syncOfflineMutation}) => {
    syncOfflineMutation = syncOfflineMutation || new SyncOfflineMutation({apolloClient, storage: this.storage})
    await syncOfflineMutation.init()
    await syncOfflineMutation.sync()
    this.clearQueue()
  }

  open = async ({apolloClient} = {}) => {
    if (!apolloClient) return

    this.isOpen = true

    await this.resync({apolloClient})

  }
  close = () => {
    this.isOpen = false
  }
  request = (operation, forward) => {
    if (this.isOpen) {
      return forward(operation)
    }
    else {
      //if it is close enqueue first before forwarding
      this.enqueue({operation})
      //return {offline: true}
      //return forward(operation)
      return new Observable(() => {
        return () => ({isOffline: true})
      })

    }
  }
  enqueue = async (entry) => {
    const item = {...entry}
    const {operation} = item
    const {query, variables} = operation || {}
    let definitions = []

    if (query && query.definitions)
      definitions = query.definitions.filter(e => e.operation === 'mutation')

    //store only if there are values for query.definitions
    if (definitions.length > 0) {
      query.definitions = definitions
      let operationName
      if(query.definitions[0] && query.definitions[0].name){
        operationName = query.definitions[0].name.value
      }
      let objectID = variables.id
      if (this.queue.length > 0 && objectID) {
        // find the index of the operation in the array matching the incoming one
        const index = this.queue.findIndex(entry => {
          if (entry.mutation.definitions[0].name.value == operationName && entry.variables.id === objectID){
            return true
          }
        })
        // if not found, add new operation directly
        if (index === -1){
          this.queue.push({mutation: query, variables})
        } else {
          // else if found, merge the variables
          let newOperationVariables = deepmerge(this.queue[index].variables, variables)
          this.queue[index].variables = newOperationVariables
        }
      } else {
        this.queue.push({mutation: query, variables})
      }


      //update the value of local storage
      this.storage.setItem(this.storeKey, JSON.stringify(this.queue))
    }

  }
  clearQueue = () => {
    this.queue = []
  }

}
