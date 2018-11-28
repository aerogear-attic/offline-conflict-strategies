import React, {Component} from 'react'
import './App.css'
import {ApolloProvider} from 'react-apollo'
import {ListUser} from './view/ListUser'
import {AddUser} from './view/AddUser'
import {setupApolloClient} from './sdk/apolloClient'
import NetworkStatus from "./view/NetworkStatus";

class App extends Component {

  state = {apolloClient: null};

  async componentDidMount() {
    const apolloClient = await setupApolloClient();
    this.setState({apolloClient})
  }

  render() {

    const {apolloClient} = this.state;
    if (!apolloClient) return 'Loading the app';

    return (
      <ApolloProvider client={apolloClient}>
        <React.Fragment>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">AeroGear Sync Offline</h1>
              <NetworkStatus />
            </header>
          </div>
          <div className="container">
            {/* <SyncButton/> */}
            <AddUser/>
            <ListUser first="1"/>
            <div>
            </div>
          </div>
        </React.Fragment>
      </ApolloProvider>
    )
  }
}

export default App
