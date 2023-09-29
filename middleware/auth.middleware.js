const { GraphQLError } = require('graphql')

const CheckAuthentication = (req, res, next) => {

    const authorizaztionHeaders = req.headers["authorization"]

    if (!authorizaztionHeaders) return res.status(401).json({
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, usernameAndPassword] = authorizaztionHeaders.split(" ");

    if (authType !== 'Basic') return res.status(401).json({
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    const [username, password] = Buffer.from(usernameAndPassword, "base64").toString("ascii").split(':')

    if (!username || !password) return res.status(401).json({
        message: 'Access Denied',
        detail: 'no username or password'
    })

    const config = {
        username: "uname",
        password: "pword"
    }

    if (username !== config.username || password !== config.password) return res.status(401).json({
        message: 'Access Denied',
        detail: 'wrong username or password'
    })

    req.user = {
        username,
        password
    }

    return next()
}

const GQLErrorHelper = (message, data) => new GraphQLError(message, data)

const CheckAuthenticationGraphQL = (resolve, root, args, context, info) => {

    const authorizaztionHeaders = context.req.headers["authorization"]

    if (!authorizaztionHeaders) throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, usernameAndPassword] = authorizaztionHeaders.split(" ");

    if (authType !== 'Basic') return res.status(401).json({
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    const [username, password] = Buffer.from(usernameAndPassword, "base64").toString("ascii").split(':')

    if (!username || !password) throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'no username or password'
    })

    const config = {
        username: "uname",
        password: "pword"
    }

    if (username !== config.username || password !== config.password) throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'wrong username or password'
    })

    context.req.user = {
        username,
        password
    }

    return resolve()
}

const applyMiddlewareOnResolver = (resolver, middleware) => {
    return resolver.reduce((array, current) => {
        array[current] = middleware
        return array
    }, {})
}

const resolverWithMiddleware = (queryField, mutationField) => {
    return {
        Query: applyMiddlewareOnResolver(queryField, CheckAuthenticationGraphQL),
        Mutation: applyMiddlewareOnResolver(mutationField, CheckAuthenticationGraphQL)
    }
}

module.exports = {
    CheckAuthentication,
    CheckAuthenticationGraphQL: (query, mutation) => resolverWithMiddleware(query, mutation)
}