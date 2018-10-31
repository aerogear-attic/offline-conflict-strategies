const express = require('express')
const fs = require('fs')
const path = require('path')

const { ApolloServer } = require('apollo-server-express')
const { handleConflict, detectConflict, conflictHandlers } = require('./sdk')

const connect = require('./db')
const schema = require('./schema')

const dbOptions = {
  database: process.env.POSTGRES_DATABASE || 'users',
  user: process.env.POSTGRES_USERNAME || 'postgresql',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT || '5432'
}

const PORT = 4000

async function start () {
  // connect to db
  const db = await connect(dbOptions)
  const app = express()

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) => {
      // pass request + db ref into context for each resolver
      return {
        req: req,
        db: db,
        detectConflict,
        handleConflict,
        conflictHandlers
      }
    },
    playground: {
      settings: {
        'editor.theme': 'light',
        'editor.cursorShape': 'block'
      },
      tabs: [
        {
          endpoint: `http://localhost:${PORT}/graphql`,
          variables: JSON.stringify({}),
          query: fs.readFileSync(path.resolve(__dirname, './playground.gql'), 'utf8')
        }
      ]
    }
  })
  apolloServer.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`🚀  Server ready at http://localhost:${PORT}/graphql`)
  })
}

start()