const { ApolloError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const secret = 'hidden';

const GenerateToken = async (payload) => jwt.sign({ user: payload }, secret, { expiresIn: '1h' });

const GQLErrorHelper = (data) => new ApolloError(data.message || data);

const CheckAuthJWT = async (resolve, root, args, context, info) => {
    const authorizaztionHeaders = context.req.headers['authorization'];

    if (!authorizaztionHeaders)
        throw GQLErrorHelper({
            message: 'Access Denied',
            detail: 'no auth header',
        });

    const [authType, token] = authorizaztionHeaders.split(' ');

    if (authType !== 'Bearer')
        throw GQLErrorHelper({
            message: 'Access Denied',
            detail: 'wrong auth type',
        });

    if (!token)
        throw GQLErrorHelper({
            message: 'Access Denied',
            detail: 'token undefined',
        });

    return jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            throw GQLErrorHelper({
                message: 'Forbidden',
                detail: err.message,
            });
        }

        context.user = {
            username: decoded.user,
        };

        console.log(`[INFO] ${context.user.username} accessing ${info.fieldName}`);

        return resolve(root, args, context, info);
    });
};

const applyMiddlewareOnResolver = (resolver, middleware) =>
    resolver.reduce((array, current) => {
        array[current] = middleware;
        return array;
    }, {});

const resolverWithMiddleware = (queryField, mutationField, middleware) => {
    return {
        Query: applyMiddlewareOnResolver(queryField, middleware),
        Mutation: applyMiddlewareOnResolver(mutationField, middleware),
    };
};

const CheckAuthJWTREST = async (req, res, next) => {
    const authorizaztionHeaders = req.headers['authorization'];
    if (!authorizaztionHeaders) {
        return res.status(401).json({ message: 'auth: no auth header' });
    }

    const [authType, token] = authorizaztionHeaders.split(' ');
    if (authType !== 'Bearer') {
        return res.status(401).json({ message: 'auth: wrong auth type' });
    }
    if (!token) {
        return res.status(401).json({ message: 'auth: no token' });
    }

    return jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'auth: token verify', err });
        }

        req.user = {
            username: decoded.user,
            token: token,
        };

        console.log(`[INFO] ${req.user.username} accessing ${req.path}`);

        return next();
    });
};

module.exports = {
    GenerateToken,
    CheckAuthJWT: (query, mutation) => resolverWithMiddleware(query, mutation, CheckAuthJWT),
    CheckAuthJWTREST,
};
