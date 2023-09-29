const bookService = require('../../service/book.service')

const getBooks = async (parent) => {
    const [_, data] = await bookService.readAll()
    return data
}

const getBookById = async (parent, { bookId }) => {
    const [_, data] = await bookService.readOne(bookId)
    return data
}

const createBooks = async (parent, { booksData }) => {
    const [_, data] = await bookService.createMany(booksData)
    return data
}

const updateBookById = async (parent, { bookId, bookData }) => {
    const [_, data] = await bookService.updateOne(bookId, bookData)
    return data
}

const deleteBooks = async (parent) => {
    const [_, data] = await bookService.deleteAll()
    return data?.message
}

const deleteBookById = async (parent, { bookId }) => {
    const [_, data] = await bookService.deleteOne(bookId)
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