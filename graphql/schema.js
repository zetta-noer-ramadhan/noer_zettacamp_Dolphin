const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = require('./types/index.type');
const resolvers = require('./resolvers/index.resolver');

module.exports = makeExecutableSchema({ typeDefs, resolvers });
