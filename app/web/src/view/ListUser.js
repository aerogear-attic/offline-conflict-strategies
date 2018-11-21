import React from 'react'
import { Query } from 'react-apollo'
import { Button, ButtonToolbar, ButtonGroup, Table } from 'react-bootstrap'
import moment from 'moment'
import { Utils } from 'pcmli.umbrella.uni-core'
import { withApollo } from 'react-apollo'

import { GET_USERS, USER_SUBSCRIPTION, DELETE_USER, UPDATE_USER } from '../queries'

export class ListUserTable extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.props.allUsers.map((item, key) => <UserItem key={key}  {...{ item }} />)}
        </tbody>
      </Table>
    )
  }
}

export class ListUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { first: Number(props.first) };
    // This binding is necessary to make `this` work in the callback
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleLoadMore(fetchMore) {
    this.setState(state => ({
      first: state.first * 2
    }));
    fetchMore({
      variables: {
        first: this.state.first
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          allUsers: [...prev.allUsers, ...fetchMoreResult.allUsers]
        });
      }
    })
  }

  handleSubscribeForMore(subscribeToMore) {
    if (!this.userUpdatesSubscription) {
      this.userUpdatesSubscription = subscribeToMore({
        document: USER_SUBSCRIPTION,
        updateQuery: this.subscriptionUpdate,
      })
    } else {
      // detect error and resubscribe if needed = UserUpdatesSubscription.catch()
      console.log("Already subscribed to UserCreated updates.")
    }
  }

  subscriptionUpdate(prev, { subscriptionData }) {
    console.log(prev, subscriptionData)
    if (!subscriptionData.data) return prev;
    if (prev.allUsers && Array.isArray(prev.allUsers)) {
      const newItem = subscriptionData.data.userCreated;
      console.log("Added new item using subscription", newItem)
      return {
        allUsers: [...prev.allUsers, newItem]
      };
    }
    return prev;
  }

  render() {
    return (
      <Query query={GET_USERS} fetchPolicy="cache-and-network" errorPolicy="all">
        {({ networkStatus, subscribeToMore, fetchMore, refetch, error, data = {} }) => {

          const { allUsers = [] } = data
          if (error && networkStatus === 8) console.info("Network error. Using cached data", allUsers)
          return (
            <div>
              <ListUserTable allUsers={allUsers} ></ListUserTable>
              <ButtonToolbar>
                <Button bsStyle="success" onClick={() => refetch()}>Refresh</Button>
                <Button bsStyle="info" onClick={() => this.handleLoadMore(fetchMore)}>Load more</Button>
                <Button bsStyle="info" onClick={() => this.handleSubscribeForMore(subscribeToMore)}>Subscribe for more</Button>
              </ButtonToolbar>
            </div>
          )
        }}
      </Query>
    )
  }
}

class UserItem extends React.Component {

  state = { loading: false, isOffline: false }

  constructor() {
    super()
    window.addEventListener('online', () => this.setState({ isOffline: false }))
    window.addEventListener('offline', () => this.setState({ isOffline: true }))
  }

  updateList = (cache) => {
    const { allUsers } = cache.readQuery({ query: GET_USERS })
    cache.writeQuery({
      query: GET_USERS,
      data: {
        allUsers: allUsers
      }
    })
  }


  onUpdate = async ({ item }) => {
    const { client } = this.props
    const { isOffline } = this.state
    const variables = { name: `${item.name}_${Utils.generateId(1)}`, dateOfBirth: new moment().toString(), id: item.id, version: item.version }
    const updateContext = {
      deBounceKey: 1,
      deBounceDelay : 10000
    }

    //use the variable input as the value of optimisticResponse added on the props

    const optimisticResponse = {
      __typename: 'Mutation',
      updateUser: {
        __typename: 'User',
        ...variables
      }
    }
    this.setState({ loading: true })
    if (isOffline) {
      client.mutate({ mutation: UPDATE_USER, variables, optimisticResponse, errorPolicy: 'ignore', update: this.updateList, updateContext})
      this.setState({ loading: false })
    }
    else {
      try {
        await client.mutate({
          mutation: UPDATE_USER,
          variables,
          updateContext,
          optimisticResponse,
          errorPolicy: 'ignore',
          refetchQueries: [{
            query: GET_USERS
          }]
        })
      }
      finally {
        this.setState({ loading: false })
      }
    }
  }

  incrementVersion = (version) => {
    return version + 1
  }

  updateDelete = (cache, { data: { deleteUser } }) => {
    const { allUsers } = cache.readQuery({ query: GET_USERS })
    const newUsers = allUsers.filter((user) => {
      return deleteUser.id !== user.id
    });
    cache.writeQuery({
      query: GET_USERS,
      data: {
        allUsers: newUsers
      }
    })
  }

  onDelete = async ({ item }) => {
    const { client } = this.props
    const variables = { id: item.id }
    this.setState({ loading: true })
    await client.mutate({ mutation: DELETE_USER, variables, update: this.updateDelete })
    this.setState({ loading: false })
  }


  render() {
    const { item } = this.props
    const { loading } = this.state
    return (
      <tr>
        <td>{item.name}</td>
        <td>{item.dateOfBirth.toString()}</td>
        <td>
          <ButtonGroup>
            <Button bsStyle="warning" disabled={loading} onClick={() => this.onUpdate({ item })}>Update</Button>
            <Button bsStyle="danger" disabled={loading} onClick={() => this.onDelete({ item })}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    )
  }


}

UserItem = withApollo(UserItem)


