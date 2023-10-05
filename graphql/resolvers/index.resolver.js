const bookResolver = require('./book.resolver')
const bookshelfResolver = require('./bookshelf.resolver')
const authResolver = require('./auth.resolver')

module.exports = {
    Query: {
        ...bookResolver.query,
        ...bookshelfResolver.query,
        ...authResolver.query
    },
    Mutation: {
        ...bookResolver.mutation,
        ...bookshelfResolver.mutation,
        ...authResolver.mutation
    },
    ...bookResolver.main,
    ...bookshelfResolver.main,
    ...authResolver.main

}