const songResolver = require('./song.resolver')
const playlistResolver = require('./playlist.resolver')
const userResolver = require('./user.resolver')
const authResolver = require('./auth.resolver')

const resolverBuilder = (resolvers) => {

    let data = {
        Query: {},
        Mutation: {},
    }

    resolvers.forEach(res => {
        data.Query = { ...data.Query, ...res.query }
        data.Mutation = { ...data.Mutation, ...res.mutation }
        data = { ...data, ...res.main }
    })

    return data
}

module.exports = resolverBuilder([songResolver, playlistResolver, userResolver, authResolver])