import React from 'react'
import { Mutation } from 'react-apollo'
import { Button } from 'react-bootstrap'
import { createNewOptimisticResponse, generateId } from '../sdk/optimisitcUIEnhancer'
import { ADD_USER, GET_USERS,  } from '../queries'

const update = (cache, { data: { createUser } }) => {
  const { allUsers } = cache.readQuery({ query: GET_USERS })
  cache.writeQuery({
    query: GET_USERS,
    data: { allUsers: allUsers.concat([createUser]) }
  })
}
const setOptimisticResponse = (data) => {
  return createNewOptimisticResponse("createUser", "User", data)
}

export class AddUser extends React.Component {

  state = { name: 'User 1', dateOfBirth: new Date(), counter: 1 }

  render() {
    return (
      <div style={{ "marginTop": "10px", "marginBottom": "10px" }}>
        <Mutation mutation={ADD_USER} update={update}
                  optimisticResponse={setOptimisticResponse(this.state)}>
          {(createUser) => {
            return (
              <Button bsStyle="primary" onClick={() => {
                createUser({ variables: { name: this.state.name, dateOfBirth: this.state.dateOfBirth } })
                const ctr = this.state.counter + 1
                this.setState({ name: `User ${ctr}`, dateOfBirth: new Date(), counter: ctr })
              }}>Add new</Button>
            )
          }}
        </Mutation>

      </div>
    )
  }
}
