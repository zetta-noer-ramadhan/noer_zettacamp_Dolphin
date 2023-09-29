const bookshelfService = require('../../service/bookshelf.service')

const getBookshelves = async (parent) => {
    const [_, data] = await bookshelfService.getMany()
    return data
}
const getBookshelfById = async (parent, { bookshelfId }) => {
    const [_, data] = await bookshelfService.get(bookshelfId)
    return data
}

const createBookshelves = async (parent, { bookshelvesData }) => {
    const [_, data] = await bookshelfService.createMany(bookshelvesData)
    return data
}

const updateBookshelfById = async (parent, { bookshelfId, bookshelfData }) => {
    const [_, data] = await bookshelfService.updateOne(bookshelfId, bookshelfData)
    return data
}

const deleteBookshelves = async (parent) => {
    const [_, data] = await bookshelfService.deleteMany()
    return data?.message
}

const deleteBookshelfById = async (parent, { bookshelfId }) => {
    const [_, data] = await bookshelfService.delete(bookshelfId)
    return data?.message
}

const insertBooksToBookshelf = async (parent, { bookshelfId, booksIds }) => {
    const [_, data] = await bookshelfService.insert(bookshelfId, booksIds)
    return data?.message
}

const insertBookToBookshelf = async (parent, { bookshelfId, bookId }) => {
    const [_, data] = await bookshelfService.insert(bookshelfId, { bookIds: [bookId] })
    return data?.message
}

const removeBooksFromBookshelf = async (parent, {bookshelfId}) => {
    const [_, data] = await bookshelfService.removeMany(bookshelfId)
    return data?.message
}

const removeBookFromBookshelf = async (parent, { bookshelfId, bookId }) => {
    const [_, data] = await bookshelfService.remove(bookshelfId, bookId)
    return data?.message
}

module.exports = {
    query: {
        getBookshelves,
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
    }
}