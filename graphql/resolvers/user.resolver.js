const { ApolloError } = require('apollo-server-express');
const service = require('../../service/user.service');

const GetAllUsers = async () => {
    const data = await service.GetAll();
    if (!data) throw new ApolloError('something is not right');
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const GetUserByUsername = async (_, { username }, context) => {
    if (!username) {
        throw new ApolloError('bad params');
    }
    if (!context || !context.userLoader) {
        throw new ApolloError('no context or loader');
    }

    try {
        const data = await context.userLoader.load(username);
        return data;
    } catch (error) {
        throw new ApolloError(error);
    }
};

const Register = async (_, { user_data }) => {
    const data = await service.CreateMany([user_data]);
    if (!data) throw new ApolloError('something is not right');
    if (data && data[0].err) throw new ApolloError(data[0].err);
    return data[0];
};

module.exports = {
    query: {
        GetAllUsers,
        GetUserByUsername,
    },
    mutation: {
        Register,
    },
};
