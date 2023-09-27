const { gql } = require('apollo-server-express')

const typeDefs = gql`#graphql
    type Book {
        _id: ID!,
        title: String!,
        author: Author!,
        genre: [String!]!
        price: Int!
        on_sale: Boolean!
    }

    type Author {
        _id: ID!,
        name: String!,
        books: [Book]
    }

    type Officer {
        name: String!,
        age: Int!
    }

    type Bookshelf {
        _id: ID,
        name: String!,
        books: [Book],
        genres: [String],
        officer: [Officer]
    }

    type Query {
        books: [Book]
        book(bookId: ID!): Book
        authors: [Author]
        bookshelves: [Bookshelf]
        bookshelf(bookshelfId: ID!): Bookshelf
    }

    type Mutation {
        createBook(title: String!, author: String!, genre: [String!]!, price: Int!, on_sale: Boolean!): Book
        deleteBook(bookId: ID!): Book
    }
`

module.exports = typeDefs