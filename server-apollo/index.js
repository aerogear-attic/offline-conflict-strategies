const { ApolloServer, gql } = require('apollo-server');
const { SyncServerError, detectConflict } = require('./sdk/ConflictSupport')
const moment = require('moment')

const users = [
    {
        id: 1,
        name: 'Stephen',
        dateOfBirth: new moment().toString(),
        version: 1
    },
    {
        id: 2,
        name: 'Wojciech',
        dateOfBirth: new moment().toString(),
        version: 1
    },
    {
        id: 3,
        name: 'Passos',
        dateOfBirth: new moment().toString(),
        version: 1
    },
    {
        id: 4,
        name: 'Dara',
        dateOfBirth: new moment().toString(),
        version: 1
    }
]

// Schema
const typeDefs = gql`

type User {
    id: ID!
    name: String!
    dateOfBirth: String!
    version: Int!
}

type Query {
    allUsers: [User],
    getUser(id: Int!): User
}

type Mutation {
    createUser(name: String!, dateOfBirth: String!): User
    updateUser(id: ID!, name: String, dateOfBirth: String, version: Int!): User
    deleteUser(id: ID!): User
}
`

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
    Query: {
        allUsers: () => users,
        getUser: (obj, args, context, info) => {
            for (let value of users) {
                if (args.id == value.id) {
                    return value
                }
            }
            throw new SyncServerError(`Couldn't find user with id ${id}`)
        }
    },

    Mutation: {
        createUser: (obj, args, context, info) => {
            args.id = new Date().getTime()
            args.version = 1
            users.push(args)
            return args
        },
        updateUser: (obj, args, context, info) => {
            for (let user of users) {
                if (args.id == user.id) {
                    const conflict = detectConflict(user, args);
                    if (conflict) {
                        console.warn(`Conflict detected. Server: ${user} client: ${args}`)
                        throw conflict;
                    }
                    console.log(`Updating user: ${args}`)
                    user.name = args.name
                    user.dateOfBirth = args.dateOfBirth
                    user.version = args.version
                    return user
                }
            }
        },
        deleteUser: (obj, args, context, info) => {
            for (var i = 0; i < users.length; i++) {
                if (args.id == users[i].id) {
                    let returningUser = users[i]
                    users.splice(i, 1)
                    return returningUser
                }
            }
            throw new Error(`Couldn't find user with id ${args.id}`)
        }
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
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
    `
        }]
    }
})

apolloServer.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
