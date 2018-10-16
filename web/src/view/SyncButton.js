import React from 'react'
import {Button} from 'react-bootstrap'
import {withApollo} from 'react-apollo'
import {SyncOfflineMutation} from '../mutations/SyncOfflineMutation'

export class SyncButton extends React.Component {

  state = { }
  
  async componentDidMount() {
    this.syncOfflineMutation = new SyncOfflineMutation({apolloClient: this.props.client, storage: window.localStorage })
    await this.syncOfflineMutation.init()
  }


  sync = async () => {
    if(this.syncOfflineMutation.hasOfflineData()){
      await this.syncOfflineMutation.sync()
      alert("Data synchronized with server!")
    }else{
      alert("No data to sync!")
    }
  }

  render() {
    return <div><Button bsStyle="danger" onClick={this.sync}>Sync Offline data</Button></div>
  }
}

SyncButton = withApollo(SyncButton)
