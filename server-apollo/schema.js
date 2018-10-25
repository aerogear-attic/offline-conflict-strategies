const { gql } = require('apollo-server')
const { makeExecutableSchema } = require('graphql-tools')
const { GraphQLNonNull } = require('graphql')
const { combineResolvers, pipeResolvers } = require('graphql-resolvers')

const typeDefs = gql`
# type Feedback {
#   id: ID!
#   text: String!
#   votes: Int!
#   author: User!
# }
type User {
  id: ID!
  name: String!
  dateOfBirth: String!
  version: Int
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
  updateUser(id: ID!, name: String, dateOfBirth: String, version: Int!): User
  deleteUser(id: ID!, version: Int!): User
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
    allUsers: async (obj, args, context) => {
      const result = await context.db.select().from('users')
      return result
    },
    getUser: async (obj, args, context, info) => {
      const result = await context.db.select().from('users').where('id', args.id).then((rows) => rows[0])
      return result
    }
  },

  Mutation: {
    createUser: async (obj, args, context, info) => {
      const result = await context.db('users').insert({ ...args, version: 1 }).returning('*').then((rows) => rows[0])
      return result
    },
    updateUser: async (obj, args, context, info) => {
      const currentRecord = await context.db('users').select().where('id', args.id).then((rows) => rows[0])
      if (!currentRecord) return null // or not found error??

      const conflict = context.detectConflict(currentRecord, args) // detect conflict
      if (conflict) {
        return context.conflicts.default(conflict, currentRecord, args) //resolve conflict
      }

      const { id, version, ...updateArgs } = args
      const result = await context.db('users').update({ ...updateArgs, version: version + 1 }).where({'id': id }).returning('*').then((rows) => rows[0])
      return result
    },
    deleteUser: async (obj, args, context, info) => {
      const result = await context.db('users').delete().where('id', args.id).returning('*').then((rows) => rows[0])
      return result
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

// ignore all this :)

// function detectConflicts (obj, args, context, info) {
//   console.log('checking for conflicts first')
//   return 'ok'
// }

// function mutationAcceptsVersionArgument(mutation) {
//   return mutation.args.some((arg) => {
//     // arg.type is a slightly different shape if it's a GraphQLNonNull instance
//     const type = (arg.type instanceof GraphQLNonNull) ? arg.type.ofType.name : arg.type.name

//     if (arg.name !== 'version') return false
//     if (arg.name === 'version' && type === 'Int') return true
//     if (arg.name === 'version' && type !== 'Int') throw new Error(`error in mutation ${mutation.name}: type ${type} is not allowed on version argument`)
//   })
// }

// const mutationType = schema.getMutationType()
// const fields = mutationType.getFields()

// for (let key of Object.keys(fields)) {
//   const mutation = fields[key]
//   if (mutationAcceptsVersionArgument(mutation)) {
//     mutation.resolve = pipeResolvers(detectConflicts, mutation.resolve)
//   }
// }

module.exports = schema
