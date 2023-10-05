const { gql } = require('apollo-server-express')

const bookType = gql`#graphql
    type Book {
        _id: ID,
        title: String,
        author_id: Author,
        genre: [String]
        price: Int
        on_sale: Boolean
    }

    type Author {
        _id: ID,
        name: String,
        books_id: [Book]
    }

    input BookData {
        title: String,
        author: String,
        genre: [String],
        price: Int,
        on_sale: Boolean
    }

    extend type Query {
        getAllBooks: [Book]
        getBookById(book_id: ID): Book
    }

    extend type Mutation {
        createManyBooks(books_data: [BookData]): [Book],
        updateBookById(book_id: ID, book_data: BookData): Book
        deleteBookById(book_id: ID): Book
    }
`

module.exports = bookType