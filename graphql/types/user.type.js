const { gql } = require('apollo-server-express')

const userType = gql`#graphql
    type User {
        _id: ID
        username: String
        first_name: String
        last_name: String
    }

    input UserData {
        username: String
        first_name: String
        last_name: String
        password: String
    }

    extend type Query {
        getAllUsers: [User]
        getUserByUsername(username: String): User
    }

    extend type Mutation {
        register(userData: UserData): User
        createUsers(usersData: [UserData]): [User]
        updateUserByUsername(username: String, userData: UserData): User
        deleteUserByUsername(username: String): User
    }
`

module.exports = userType