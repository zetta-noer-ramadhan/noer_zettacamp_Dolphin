const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const secret = 'hidden'

const CheckAuthentication = (req, res, next) => {

    const authorizaztionHeaders = req.headers['authorization']

    if (!authorizaztionHeaders) return res.status(401).json({
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, usernameAndPassword] = authorizaztionHeaders.split(' ');

    if (!authType || !usernameAndPassword) return res.status(401).json({
        message: 'Access Denied',
        detail: 'no auth header'
    })

    if (authType !== 'Basic') return res.status(401).json({
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    const [username, password] = Buffer.from(usernameAndPassword, 'base64').toString('ascii').split(':')

    if (!username || !password) return res.status(401).json({
        message: 'Access Denied',
        detail: 'no username or password'
    })

    const config = {
        username: 'uname',
        password: 'pword'
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

const CheckAuthenticationGraphQL = (resolve, root, args, context) => {

    const authorizaztionHeaders = context.req.headers['authorization']

    if (!authorizaztionHeaders) throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, usernameAndPassword] = authorizaztionHeaders.split(' ');

    if (!authType || !usernameAndPassword) throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'wrong auth header'
    })

    if (authType !== 'Basic') throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    const [username, password] = Buffer.from(usernameAndPassword, 'base64').toString('ascii').split(':')

    if (!username || !password) throw GQLErrorHelper('Access Denied', {
        message: 'Access Denied',
        detail: 'no username or password'
    })

    const config = {
        username: 'uname',
        password: 'pword'
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

const GenerateToken = async (payload) => {
    return jwt.sign(
        { user: payload },
        secret,
        { expiresIn: '1h' }
    )
}

const CheckAuthenticationJWT = async (resolve, root, args, context) => {

    const authorizaztionHeaders = context.req.headers['authorization']

    if (!authorizaztionHeaders) throw GQLErrorHelper('access denied', {
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, token] = authorizaztionHeaders.split(' ');

    if (!authType || authType !== 'Bearer') throw GQLErrorHelper('access denied', {
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    if (!token) throw GQLErrorHelper('access denied', {
        message: 'Access Denied',
        detail: 'token undefined'
    })

    return jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            throw GQLErrorHelper('Forbidden', {
                message: 'Forbidden',
                detail: err.message
            })
        }

        context.user = {
            username: decoded.user
        }

        return resolve(root, args, context)
    })

}

const ApplyMiddlewareOnResolver = (resolver, middleware) => {
    return resolver.reduce((array, current) => {
        array[current] = middleware
        return array
    }, {})
}

const ResolverWithMiddleware = (queryField, mutationField, middleware) => {
    return {
        Query: ApplyMiddlewareOnResolver(queryField, middleware),
        Mutation: ApplyMiddlewareOnResolver(mutationField, middleware)
    }
}

module.exports = {
    CheckAuthentication,
    CheckAuthenticationGraphQL: (query, mutation) => ResolverWithMiddleware(query, mutation, CheckAuthenticationGraphQL),
    GenerateToken,
    CheckAuthenticationJWT: (query, mutation) => ResolverWithMiddleware(query, mutation, CheckAuthenticationJWT)
}