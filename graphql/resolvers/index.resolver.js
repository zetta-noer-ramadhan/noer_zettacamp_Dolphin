const bookResolver = require('./book.resolver')
const bookshelfResolver = require('./bookshelf.resolver')

module.exports = {
    Query: {
        ...bookResolver.query,
        ...bookshelfResolver.query
    },
    Mutation: {
        ...bookResolver.mutation,
        ...bookshelfResolver.mutation
    },
}