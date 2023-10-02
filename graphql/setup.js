const { ApolloServer } = require('apollo-server-express')
const { applyMiddleware } = require('graphql-middleware')
const { fieldBuilder } = require('../helper/util')
const { CheckAuthJWT } = require('../middleware/auth.middleware')

const loader = require('./loaders/index.loader')
const resolver = require('./resolvers/index.resolver')
const schema = require('./schema')

const queryField = fieldBuilder(Object.keys(resolver.Query), [])
const mutationField = fieldBuilder(Object.keys(resolver.Mutation), ['login'])

const protectedSchema = applyMiddleware(schema, CheckAuthJWT(queryField, mutationField))

const server = new ApolloServer({
    schema: protectedSchema,
    context: ({ req }) => ({
        req: req,
        ...loader
    })
})

module.exports = {
    init: (app) => server.applyMiddleware({ app })
}