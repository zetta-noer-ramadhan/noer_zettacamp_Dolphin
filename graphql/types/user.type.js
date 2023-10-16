const { gql } = require('apollo-server-express');

const userType = gql`
    #graphql
    type User {
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
        GetAllUsers: [User]
        GetUserByUsername(username: String): User
    }

    extend type Mutation {
        Register(user_data: UserData): User
    }
`;

module.exports = userType;
