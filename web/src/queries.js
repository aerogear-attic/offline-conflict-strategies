import gql from 'graphql-tag'

export const ADD_USER = gql`
mutation createUser($dateOfBirth: String!, $name: String!){
    createUser(dateOfBirth: $dateOfBirth, name: $name){
      id
      name
      dateOfBirth
      version
    }
  }
`


export const GET_USERS = gql`
  query allUsers($first: Int) {
    allUsers(first: $first){
      id
      name
      dateOfBirth
      version
    }
}
`

export const DELETE_USER = gql`
mutation deleteUser($id: ID!){
  deleteUser(id: $id){
    id
    name
    dateOfBirth
    version
  }
}
`

export const UPDATE_USER = gql`
mutation updateUser($dateOfBirth: String, $id: ID!, $name: String, $version: Int!) {
  updateUser(dateOfBirth: $dateOfBirth, id: $id, name: $name, version: $version) {
    dateOfBirth
    id
    name
    version
  }
}
`

