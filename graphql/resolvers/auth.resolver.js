const { ApolloError } = require('apollo-server-express')
const { GenerateToken } = require('../../middleware/auth.middleware')

const login = async (parent, { username, password }) => {

    if (!username || !password) {
        throw new ApolloError('empty username or password')
    }

    const config = {
        username: "uname",
        password: "pword"
    }

    if (username !== config.username || password !== config.password) {
        throw new ApolloError('wrong username or password')
    }

    const token = GenerateToken(username)

    return { token }
}

module.exports = {
    query: {},
    mutation: {
        login
    },
    main: {}
}