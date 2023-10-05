const { gql } = require('apollo-server-express')

const bookshelfType = gql`#graphql

    type Officer {
        name: String,
        age: String
    }

    type Bookshelf {
        _id: ID,
        name: String,
        books_id: [Book],
        genres: [String],
        officers: [Officer]
    }

    input BookshelfData {
        name: String
    }

    extend type Query {
        getAllBookshelves: [Bookshelf]
        getBookshelfById(bookshelf_id: ID): Bookshelf
        getAllBookshelvesByBookId(book_id: ID): [Bookshelf]
    }

    extend type Mutation {
        createManyBookshelves(bookshelves_data: [BookshelfData]): [Bookshelf]
        updateBookshelfById(bookshelf_id: ID, bookshelf_data: BookshelfData): Bookshelf
        deleteBookshelfById(bookshelf_id: ID): Bookshelf
        insertManyBooksToBookshelf(bookshelf_id: ID, books_ids: [ID]): Bookshelf
        insertBookToBookshelf(bookshelf_id: ID, book_id: ID): Bookshelf
        removeManyBooksFromBookshelf(bookshelf_id: ID, books_ids: [ID]): Bookshelf
        removeBookFromBookshelf(bookshelf_id: ID, book_id: ID): Bookshelf
    }
`

module.exports = bookshelfType