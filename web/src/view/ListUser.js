import React from 'react'
import { Query } from 'react-apollo'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
import moment from 'moment'
import { Utils } from 'pcmli.umbrella.uni-core'
import { withApollo } from 'react-apollo'

import { GET_USERS, DELETE_USER, UPDATE_USER } from '../queries'

export const ListUser = () => {
  return (
    <Query query={GET_USERS} fetchPolicy="cache-and-network" errorPolicy="all">
      {({ networkStatus, refetch, loading, error, data = {} }) => {

        const { allUsers = [] } = data
        if (error && networkStatus === 8) console.info("Network error. Using cached data", allUsers)

        return (
          <div>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((item, key) => <UserItem key={key}  {...{ item }} />)}
              </tbody>
            </Table>
            <Button bsStyle="success" onClick={() => refetch()}>Refresh</Button>
          </div>
        )
      }}
    </Query>
  )
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
      client.mutate({ mutation: UPDATE_USER, variables, optimisticResponse, errorPolicy: 'ignore', update: this.updateList })
      this.setState({ loading: false })
    }
    else {
      try {
        await client.mutate({
          mutation: UPDATE_USER,
          variables,
          optimisticResponse,
          errorPolicy: 'ignore'
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
        <td>{moment(item.dateOfBirth).format('d-MMM-YYYY  h:mm:ss.S a')}</td>
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


