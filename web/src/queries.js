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
  query allUsers {
    allUsers{
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
mutation updateUser($dateOfBirth: String, $id: ID!, $name: String, $expectedVersion: Int!) {
  updateUser(dateOfBirth: $dateOfBirth, id: $id, name: $name, expectedVersion: $expectedVersion) {
    dateOfBirth
    id
    name
    version
  }
}
`

export const generateId = (length = 8) => {
  let result = ''
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let i = length; i > 0; i -= 1) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
