const { ApolloError } = require('apollo-server-express')
const bookService = require('../../service/book.service')

const getBooks = async (parent) => {
    const [status, data] = await bookService.readAll()
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const getBookById = async (parent, { bookId }) => {
    const [status, data] = await bookService.readOne(bookId)
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const createBooks = async (parent, { booksData }) => {
    const [status, data] = await bookService.createMany(booksData)
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const updateBookById = async (parent, { bookId, bookData }) => {
    const [status, data] = await bookService.updateOne(bookId, bookData)
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const deleteBooks = async (parent) => {
    const [status, data] = await bookService.deleteAll()
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const deleteBookById = async (parent, { bookId }) => {
    const [status, data] = await bookService.deleteOne(bookId)
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

module.exports = {
    query: {
        getBooks,
        getBookById
    },
    mutation: {
        createBooks,
        updateBookById,
        deleteBooks,
        deleteBookById
    }
}