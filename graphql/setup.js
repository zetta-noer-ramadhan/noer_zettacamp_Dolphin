const { ApolloServer } = require('apollo-server-express')
const { applyMiddleware } = require('graphql-middleware')

const { CheckAuthenticationGraphQL } = require('../middleware/auth.middleware')

const schema = require('./schema')

const queryField = ['getBooks', 'getBookshelves']
const mutationField = []

const protectedSchema = applyMiddleware(schema, CheckAuthenticationGraphQL(queryField, mutationField))

const server = new ApolloServer({
    schema: protectedSchema,
    context: ({ req }) => ({
        req: req
    })
})

module.exports = {
    init: (app) => server.applyMiddleware({ app })
}