const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { applyMiddleware } = require('graphql-middleware')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const { CheckAuthenticationGraphQL } = require('../middleware/auth.middleware')

const executableSchema = makeExecutableSchema({ typeDefs, resolvers })
const protectedSchema = applyMiddleware(executableSchema, CheckAuthenticationGraphQL)

const server = new ApolloServer({
    schema: protectedSchema,
    context: ({req}) => ({
        req: req
    })
})

module.exports = {
    init: (app) => server.applyMiddleware({ app })
}