const mongoose = require('mongoose')

const authorModel = require('../model/author.model')
const bookModel = require('../model/book.model')
const bookshelfModel = require('../model/bookshelf.model')

const query = {}
const mutation = {}



query.books = async (parent) => {

    const data = await bookModel
        .find({})
        .populate('author', 'name')

    return data
}

query.book = async (parent, { bookId }) => {

    const validBookId = mongoose.Types.ObjectId(bookId)

    const data = await bookModel
        .findById(validBookId)
        .populate('author', 'name')

    return data
}

query.authors = async (parent) => {

    const data = await authorModel
        .find({})
        .populate('books', 'title')

    return data
}

query.bookshelves = async (parent) => {

    const data = await bookshelfModel
        .find({})
        .populate({
            path: 'books',
            populate: {
                path: 'author',
                model: 'Author',
                select: 'name'
            }
        })

    return data
}

query.bookshelf = async (parent, { bookshelfId }) => {

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const data = await bookshelfModel
        .findById(validBookshelfId)
        .populate({
            path: 'books',
            populate: {
                path: 'author',
                model: 'Author',
                select: 'name'
            }
        })

    return data
}



mutation.createBook = async (parent, { title, author, genre, price, on_sale }) => {

    const authorData = await authorModel
        .findOneAndUpdate({ name: author }, { name: author }, { upsert: true })

    const bookData = await bookModel
        .create({
            title,
            author: authorData._id,
            genre,
            price,
            on_sale
        })

    const data = await bookModel
        .findById(bookData._id)
        .populate('author', 'name')

    return data
}

mutation.deleteBook = async (parent, { bookId }) => {

    const validBookId = mongoose.Types.ObjectId(bookId)

    const data = await bookModel
        .findByIdAndDelete(validBookId)
        .populate('author', 'name')

    return data
}



const resolvers = {
    Query: query,
    Mutation: mutation
}

module.exports = resolvers