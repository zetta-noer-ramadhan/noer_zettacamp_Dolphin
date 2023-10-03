const { ApolloError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const secret = 'hidden'

const GenerateToken = async (payload) => {
    return jwt.sign(
        { user: payload },
        secret,
        { expiresIn: '1h' }
    )
}

const GQLErrorHelper = data => new ApolloError(data?.message || data)

const CheckAuthJWT = async (resolve, root, args, context, info) => {

    const authorizaztionHeaders = context.req.headers["authorization"]

    if (!authorizaztionHeaders) throw GQLErrorHelper({
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, token] = authorizaztionHeaders.split(" ");

    if (authType !== 'Bearer') throw GQLErrorHelper({
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    if (!token) throw GQLErrorHelper({
        message: 'Access Denied',
        detail: 'token undefined'
    })

    return jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            throw GQLErrorHelper({
                message: 'Forbidden',
                detail: err.message
            })
        }

        context.user = {
            username: decoded.user
        }

        return resolve(root, args, context, info)
    })

}

const applyMiddlewareOnResolver = (resolver, middleware) => {
    return resolver.reduce((array, current) => {
        array[current] = middleware
        return array
    }, {})
}

const resolverWithMiddleware = (queryField, mutationField, middleware) => {
    return {
        Query: applyMiddlewareOnResolver(queryField, middleware),
        Mutation: applyMiddlewareOnResolver(mutationField, middleware)
    }
}

module.exports = {
    GenerateToken,
    CheckAuthJWT: (query, mutation) => resolverWithMiddleware(query, mutation, CheckAuthJWT)
}