const { gql } = require('apollo-server-express')

const typeDefs = gql`#graphql
    type Query
    type Mutation
`

module.exports = [
    typeDefs,
    require('./song.type'),
    require('./playlist.type'),
    require('./user.type'),
    require('./auth.type')
]