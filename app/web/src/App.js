import React, {Component} from 'react'
import './App.css'
import {ApolloProvider} from 'react-apollo'
import {ListUser} from './view/ListUser'
import {AddUser} from './view/AddUser'
import {setupApolloClient} from './sdk/apolloClient'
import {SyncOfflineMutation} from './sdk/mutations/SyncOfflineMutation'

class App extends Component {

  state = {apolloClient: null}

  async componentDidMount() {
    const apolloClient = await setupApolloClient()

    //if there are items that needs to be sync do it here
    const syncOfflineMutation = new SyncOfflineMutation({apolloClient, storage: window.localStorage})
    await syncOfflineMutation.init()
    await syncOfflineMutation.sync()

    this.setState({apolloClient})
  }


  render() {

    const {apolloClient} = this.state
    if (!apolloClient) return 'Loading the app'

    return (
      <ApolloProvider client={apolloClient}>
        <React.Fragment>

          <div className="App">
            <header className="App-header">
              <h1 className="App-title">AeroGear Sync Offline</h1>
            </header>
          </div>
          <div className="container">
            {/* <SyncButton/> */}
            <AddUser/>
            <ListUser first="3"/>
            <div>
             
            </div>
            
          </div>

        </React.Fragment>
      </ApolloProvider>
    )
  }
}

export default App
