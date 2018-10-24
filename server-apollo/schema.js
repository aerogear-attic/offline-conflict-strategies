const { gql } = require('apollo-server')
const { ObjectId } = require('mongodb')
// const { combineResolvers, pipeResolvers } = require('graphql-resolvers')

// little hack to allow ObjectIds to be parsed by the GraphQL engine
ObjectId.prototype.valueOf = function () {
  return this.toString()
}

const typeDefs = gql`
# type Feedback {
#   id: ID!
#   text: String!
#   votes: Int!
#   author: User!
# }
type User {
  _id: ID!
  name: String!
  dateOfBirth: String!
  # feedback: [Feedback]
}
type Query {
  # allFeedbacks: [Feedback],
  # getFeedback(id: Int!): Feedback,
  allUsers: [User],
  getUser(id: ID!): User
}
type Mutation {
  createUser(name: String!, dateOfBirth: String!): User
  updateUser(id: ID!, name: String, dateOfBirth: String): User
  deleteUser(id: ID!): User
  # deleteFeedback(id: ID!): Feedback
  # createFeedback(text: String!, votes: Int!, author: ID!): Feedback
  # updateFeedback(id: ID!, text: String, votes: Int, author: ID!): Feedback
  ## Increment counter for specific feedback
  # vote(id: ID!, userId: ID!): Feedback
}
`

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
  Query: {
    allUsers: (obj, args, context) => {
      return context.db.collection('user').find({}).toArray()
    },
    getUser: (obj, args, context, info) => {
      return context.db.collection('user').findOne({ _id: ObjectId(args.id) })
    }
  },

  Mutation: {
    createUser: async (obj, args, context, info) => {
      return context.db.collection('user').insertOne(args).then((result) => result.ops[0])
    },
    updateUser: (obj, args, context, info) => {
      const updateFilter = { _id: ObjectId(args.id) }
      const updateValues = { $set: args }
      const options = { returnOriginal: false }
      return context.db.collection('user').findOneAndUpdate(updateFilter, updateValues, options).then((result) => result.value)
    },
    deleteUser: async (obj, args, context, info) => {
      return context.db.collection('user').findOneAndDelete({ _id: ObjectId(args.id) }).then((result) => result.value)
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
