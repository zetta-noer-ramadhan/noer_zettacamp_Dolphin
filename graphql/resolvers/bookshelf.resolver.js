const { ApolloError } = require('apollo-server-express')
const bookshelfService = require('../../service/bookshelf.service')

const getAllBookshelves = async (parent) => {
    const [status, data] = await bookshelfService.getMany()
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const getBookshelfById = async (parent, { bookshelfId }, context) => {
    const data = await context.bookshelfLoader.load(bookshelfId)
    return data
}

const createBookshelves = async (parent, { bookshelvesData }) => {
    const [status, data] = await bookshelfService.createMany(bookshelvesData)
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const updateBookshelfById = async (parent, { bookshelfId, bookshelfData }) => {
    const [status, data] = await bookshelfService.updateOne(bookshelfId, bookshelfData)
    if (status !== 200) throw new ApolloError(data?.message)
    return data
}

const deleteBookshelves = async (parent) => {
    const [status, data] = await bookshelfService.deleteMany()
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const deleteBookshelfById = async (parent, { bookshelfId }) => {
    const [status, data] = await bookshelfService.delete(bookshelfId)
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const insertBooksToBookshelf = async (parent, { bookshelfId, booksIds }) => {
    const [status, data] = await bookshelfService.insert(bookshelfId, booksIds)
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const insertBookToBookshelf = async (parent, { bookshelfId, bookId }) => {
    const [status, data] = await bookshelfService.insert(bookshelfId, { bookIds: [bookId] })
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const removeBooksFromBookshelf = async (parent, { bookshelfId }) => {
    const [status, data] = await bookshelfService.removeMany(bookshelfId)
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const removeBookFromBookshelf = async (parent, { bookshelfId, bookId }) => {
    const [status, data] = await bookshelfService.remove(bookshelfId, bookId)
    if (status !== 200) throw new ApolloError(data?.message)
    return data?.message
}

const books = async (parent, {}, context) => {
    if(!parent.books) throw new ApolloError('no books id')
    const data = await context.bookLoader.loadMany(parent.books)
    return data
}

module.exports = {
    query: {
        getAllBookshelves,
        getBookshelfById
    },
    mutation: {
        createBookshelves,
        updateBookshelfById,
        deleteBookshelves,
        deleteBookshelfById,
        insertBooksToBookshelf,
        insertBookToBookshelf,
        removeBooksFromBookshelf,
        removeBookFromBookshelf
    },
    main: {
        Bookshelf: {
            books
        }
    }
}