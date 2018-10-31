const { gql } = require('apollo-server')
const { makeExecutableSchema } = require('graphql-tools')
const { GraphQLNonNull } = require('graphql')
const { combineResolvers, pipeResolvers } = require('graphql-resolvers')
const { pubSub, EVENTS } = require('./subscriptions')

const typeDefs = gql`
type User {
  id: ID!
  name: String!
  dateOfBirth: String!
  version: Int
}

type Query {
  allUsers(first: Int, after: String): [User],
  getUser(id: ID!): User
}

type Mutation {
  createUser(name: String!, dateOfBirth: String!): User
  updateUser(id: ID!, name: String, dateOfBirth: String, version: Int!): User
  deleteUser(id: ID!): User
}

type Subscription {
  userCreated: User
}
`

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
  Query: {
    allUsers: async (obj, args, context) => {
      const result = context.db.select().from('users')
      if (args.first && args.after) {
        result.limit(args.first)
        result.offset(args.after)
      } else if (args.first) {
        result.limit(args.first)
      }
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
      // TODO context helper for publishing subscriptions in SDK?
      console.log("result", result);
      pubSub.publish(EVENTS.USER.CREATED, {
        userCreated: result,
      });
      return result
    },
    updateUser: async (obj, args, context, info) => {
      return new Promise((resolve, reject) => {
        context.db.transaction(async (trx) => {
          let { id, version, ...updateArgs } = args
          const currentRecord = await trx('users').select().where('id', args.id).then((rows) => rows[0])
          if (!currentRecord) return null // or not found error??

          const conflict = context.detectConflict(currentRecord, args) // detect conflict

      if (conflict) {
        updateArgs = context.handleConflict(context.conflictHandlers.RETURN_TO_CLIENT, conflict, currentRecord, args)
      }

          const result = await trx('users').update({ ...updateArgs, version: currentRecord.version + 1 }).where({ 'id': id }).returning('*').then((rows) => rows[0])
          resolve(result)
        }).catch(reject)
      })
    },
    deleteUser: async (obj, args, context, info) => {
      const result = await context.db('users').delete().where('id', args.id).returning('*').then((rows) => rows[0])
      return result
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubSub.asyncIterator(EVENTS.USER.CREATED),
    },
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = schema
