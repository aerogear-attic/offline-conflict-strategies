const express = require('express')

const { ApolloServer } = require('apollo-server-express')

const connect = require('./db')
const { typeDefs, resolvers } = require('./schema')

const dbOptions = {
  url: 'mongodb://localhost:27017',
  database: 'users'
}

const PORT = 4000

async function start () {
  // connect to db
  const db = await connect(dbOptions)
  const app = express()

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // pass request + db ref into context for each resolver
      return {
        req: req,
        db: db
      }
    },
    playground: {
      settings: {
        'editor.theme': 'light',
        'editor.cursorShape': 'block'
      },
      tabs: [{
        responses: ['{}'],
        query: `
            query allUsers {
            allUsers{
            id
            name
            feedback{
                id
                text
            }
            }
        }

        query allFeedbacks{
            allFeedbacks{
            id
            text
            votes
            }
        }

        query getFeedback{
            getFeedback(id: 1){
            id
            text
            votes
            }
        }

        query getUser{
            getUser(id: 1){
            id
            name
            }
        }

        mutation createUser{
            createUser(name: "SomeoneElse"){
            id
            name
            }
        }

        mutation updateUser{
            updateUser(id:1, name: "idiot"){
            id
            name
            }
        }

        mutation deleteUser{
            deleteUser(id:1){
            id
            name
            }
        }

        mutation deleteFeedback{
            deleteFeedback(id:1){
            id
            }
        }
            `
      }]
    }
  })
  apolloServer.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`🚀  Server ready at http://localhost:${PORT}/graphql`)
  })
}

start()
