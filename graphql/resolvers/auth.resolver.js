const { ApolloError } = require('apollo-server-express');
const { GenerateToken } = require('../../middleware/auth.middleware');
const { CheckPassword } = require('../../helper/util');

const Login = async (_, { username, password }, context) => {
    if (!username || !password) {
        throw new ApolloError('empty username or password');
    }
    if (!context || !context.userLoader) {
        throw new ApolloError('no context');
    }

    const data = await context.userLoader.load(username);
    if (!data) {
        throw new ApolloError('user not found');
    }

    const checkedPassword = await CheckPassword(password, data.password);
    if (data.username !== username || !checkedPassword) {
        throw new ApolloError('wrong username or password');
    }

    const token = GenerateToken(username);
    if (!token) {
        throw new ApolloError('no token');
    }

    return { token };
};

module.exports = {
    mutation: {
        Login,
    },
};
