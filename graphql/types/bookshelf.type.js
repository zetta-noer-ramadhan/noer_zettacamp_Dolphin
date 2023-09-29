const { gql } = require('apollo-server-express')

const bookshelfType = gql`#graphql

    type Officer {
        name: String!,
        age: Int!
    }

    type Bookshelf {
        _id: ID!,
        name: String!,
        books: [Book],
        genres: [String],
        officer: [Officer]
    }

    input BookshelfData {
        name: String!
    }

    extend type Query {
        getBookshelves: [Bookshelf]
        getBookshelfById(bookshelfId: ID!): Bookshelf
    }

    extend type Mutation {
        createBookshelves(bookshelvesData: [BookshelfData!]!): [Bookshelf]
        updateBookshelfById(bookshelfId: ID!, bookshelfData: BookshelfData!): Bookshelf
        deleteBookshelves: String
        deleteBookshelfById(bookshelfId: ID!): String
        insertBooksToBookshelf(bookshelfId: ID!, booksIds: [ID!]!): String
        insertBookToBookshelf(bookshelfId: ID!, bookId: ID!): String
        removeBooksFromBookshelf(bookshelfId: ID!, booksIds: [ID!]!): String
        removeBookFromBookshelf(bookshelfId: ID!, bookId: ID!): String
    }
`

module.exports = bookshelfType