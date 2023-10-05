const { gql } = require('apollo-server-express')

const authType = gql`#graphql
    type Auth {
        token: String
    }

    extend type Mutation {
        login(username: String, password: String): Auth
    }
`

module.exports = authType