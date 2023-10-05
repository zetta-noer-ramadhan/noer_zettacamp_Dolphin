const { ApolloError } = require('apollo-server-express')
const { GenerateToken } = require('../../middleware/auth.middleware')

const Login = async (_, { username, password }) => {

    if (!username || !password) {
        throw new ApolloError('empty username or password')
    }

    const config = {
        username: 'uname',
        password: 'pword'
    }

    if (username !== config.username || password !== config.password) {
        throw new ApolloError('wrong username or password')
    }

    const token = GenerateToken(username)
    if (!token) throw new ApolloError('no token')

    return { token }
}

module.exports = {
    mutation: {
        login: Login
    }
}