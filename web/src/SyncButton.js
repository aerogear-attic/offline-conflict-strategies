import React from 'react'
import {Button} from 'react-bootstrap'
import {withApollo} from 'react-apollo'
import {SyncOfflineMutation} from './mutations/SyncOfflineMutation'

export class SyncButton extends React.Component {

  state = {hasOfflineData: false}

  async componentDidMount() {
    this.syncOfflineMutation = new SyncOfflineMutation({apolloClient: this.props.client, storage: window.localStorage })
    await this.syncOfflineMutation.init()
    this.setState({hasOfflineData: this.syncOfflineMutation.hasOfflineData()})
  }

  sync = async () => {
    await this.syncOfflineMutation.sync()
  }

  render() {
    const {hasOfflineData} = this.state
    return <div><Button bsStyle="danger" disabled={!hasOfflineData} onClick={this.sync}>Sync Offline data</Button></div>
  }
}

SyncButton = withApollo(SyncButton)
