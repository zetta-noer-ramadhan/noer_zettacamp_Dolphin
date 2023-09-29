const { gql } = require('apollo-server-express')

const bookType = gql`#graphql
    type Book {
        _id: ID!,
        title: String!,
        author: Author,
        genre: [String!]!
        price: Int!
        on_sale: Boolean!
    }

    type Author {
        _id: ID!,
        name: String!,
        books: [Book]
    }

    input BookData {
        title: String!,
        author: String!,
        genre: [String!]!,
        price: Int!,
        on_sale: Boolean!
    }

    extend type Query {
        getBooks: [Book]
        getBookById(bookId: ID!): Book
    }

    extend type Mutation {
        createBooks(booksData: [BookData!]!): [Book],
        updateBookById(bookId: ID!, bookData: BookData!): Book
        deleteBooks: String
        deleteBookById(bookId: ID!): String
    }
`

module.exports = bookType