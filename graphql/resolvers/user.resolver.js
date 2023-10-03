const { ApolloError } = require('apollo-server-express')
const service = require('../../service/user.service')

// OK
const getAllUsers = async () => {
    const data = await service.getAll()
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const getUserByUsername = async (_, { username }, context) => {
    try {
        const data = await context.userLoader.load(username)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

// OK
const register = async (_, { userData }) => {
    const data = await service.createMany([userData])
    if (data[0]?.err) throw new ApolloError(data[0].err)
    return data[0]
}

module.exports = {
    query: {
        getAllUsers,
        getUserByUsername
    },
    mutation: {
        register
    }
}