const { ApolloServer, ApolloError } = require('apollo-server-express')
const { applyMiddleware } = require('graphql-middleware')
const { FieldBuilder } = require('../helper/util')
const { CheckAuthenticationJWT } = require('../middleware/auth.middleware')

const loader = require('./loaders/index.loader')
const resolver = require('./resolvers/index.resolver')
const schema = require('./schema')

const queryField = FieldBuilder(Object.keys(resolver.Query), [])
const mutationField = FieldBuilder(Object.keys(resolver.Mutation), ['login'])
if (!queryField || !mutationField) {
    throw new ApolloError('no resolver field for middleware')
}

const checkAuthenticationJWTOnFields = CheckAuthenticationJWT(queryField, mutationField)
if (!checkAuthenticationJWTOnFields || !checkAuthenticationJWTOnFields.Query || !checkAuthenticationJWTOnFields.Mutation) {
    throw new ApolloError('something happen when trying to apply resolver with middleware')
}

const protectedSchema = applyMiddleware(schema, checkAuthenticationJWTOnFields)

const server = new ApolloServer({
    schema: protectedSchema,
    context: ({ req }) => ({
        req: req,
        ...loader
    })
})

module.exports = {
    Init: (app) => server.applyMiddleware({ app })
}