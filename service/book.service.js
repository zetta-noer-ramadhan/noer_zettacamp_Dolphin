const mongoose = require('mongoose')
const authorModel = require('../model/author.model')
const bookModel = require('../model/book.model')

const { errorHelper } = require('../helper/util')

const books = {}

books.createOne = async (bookData) => { // OK

    const authorDataRead = await authorModel.findOne({ name: bookData.author })
    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    const bookCreated = await bookModel
        .create({ ...bookData, author: authorData._id })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    authorData.books.push(bookCreated._id)
    await authorData.save()

    return [200, {
        message: 'book added',
        detail: {
            authorData,
            bookCreated
        }
    }]
}

books.readOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return errorHelper(400, { message: 'invalid ID' })

    const bookId = mongoose.Types.ObjectId(id)

    const bookRead = await bookModel
        .findById(bookId)
        .populate('author', 'name')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookRead) return [200, {
        message: 'no book fetched',
        detail: 'book not found'
    }]

    return [200, {
        message: 'book fetched',
        detail: bookRead
    }]
}

books.readAll = async () => { // OK

    const booksRead = await bookModel
        .find()
        .populate('author', 'name')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (booksRead.length === 0) return [200, {
        message: 'no book fetched',
        detail: 'empty library'
    }]

    return [200, {
        message: 'books fetched',
        detail: booksRead
    }]
}

books.updateOne = async (id, bookData) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return errorHelper({ message: 'invalid ID' })

    const authorDataRead = await authorModel.findOne({ name: bookData.author })
    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    const bookId = mongoose.Types.ObjectId(id)

    const bookUpdated = await bookModel
        .findByIdAndUpdate(bookId, { ...bookData, author: authorData._id })
        .populate('author', 'name')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookUpdated) return [200, {
        message: 'no book updated',
        detail: 'book not found'
    }]

    return [200, {
        message: 'book updated',
        detail: bookUpdated
    }]
}

books.deleteOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return errorHelper({ message: 'invalid ID' })

    const bookId = mongoose.Types.ObjectId(id)

    const bookDeleted = await bookModel
        .findByIdAndDelete(bookId)
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookDeleted) return [200, {
        message: 'no book deleted',
        detail: 'book not found'
    }]

    return [200, {
        message: 'book deleted',
        detail: bookDeleted
    }]
}

books.deleteAll = async () => { // OK

    const booksDeleted = await bookModel
        .deleteMany()
        .catch(err => errorHelper(500, err))
        .then(data => data)

    const authorsDeleted = await authorModel
        .deleteMany()
        .catch(err => errorHelper(500, err))
        .then(data => data)

    return [200, {
        message: 'books and authors deleted',
        detail: {
            booksDeleted,
            authorsDeleted
        }
    }]
}

module.exports = books