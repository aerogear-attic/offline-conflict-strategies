import React, {Component} from 'react'
import {isMobileCordova} from "@aerogear/core";
import {CordovaNetworkStatus, WebNetworkStatus} from "@aerogear/datasync-js";

class NetworkStatus extends Component {

  constructor(props) {
    super(props);

    let networkStatus = (isMobileCordova()) ? new CordovaNetworkStatus() : new WebNetworkStatus();

    this.state = {
      online: !networkStatus.isOffline()
    };

    networkStatus.onStatusChangeListener({
      onStatusChange: (networkInfo) => {
        this.setState({online: networkInfo.online});
      }
    });
  }

  render() {
    return (this.state.online) ? "online" : "offline";
  }

}

export default NetworkStatus
