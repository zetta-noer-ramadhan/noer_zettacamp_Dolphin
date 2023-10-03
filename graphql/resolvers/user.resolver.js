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
    if (data?.err) throw new ApolloError(data.err)
    return data[0]
}

// OK
const createUsers = async (_, { usersData }) => {
    const data = await service.createMany(usersData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const updateUserByUsername = async (_, { username, userData }) => {
    const data = await service.updateByUsername(username, userData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const deleteUserByUsername = async (_, { username }) => {
    const data = await service.deleteByUsername(username)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

module.exports = {
    query: {
        getAllUsers,
        getUserByUsername
    },
    mutation: {
        register,
        createUsers,
        updateUserByUsername,
        deleteUserByUsername
    }
}