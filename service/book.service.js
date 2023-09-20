const mongoose = require('mongoose')
const authorModel = require('../model/author.model')
const bookModel = require('../model/book.model')

const books = {}

books.createOne = async (bookData) => { // OK

    const authorDataRead = await authorModel
        .findOne({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (authorDataRead?.err) return [authorDataRead.status, authorDataRead.err]


    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (authorData?.err) return [authorData.status, authorData.err]


    const bookCreated = await bookModel
        .create({ ...bookData, author: authorData._id })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (bookCreated?.err) return [bookCreated.status, bookCreated.err]


    authorData.books.push(bookCreated._id)
    const savingData = await authorData
        .save()
        .catch(err => errorHelper(500, err))

    if (savingData?.err) return [savingData.status, savingData.err]


    return [201, {
        message: 'book added',
        detail: {
            bookCreated,
            authorData
        }
    }]
}


books.readOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const bookId = mongoose.Types.ObjectId(id)

    const bookRead = await bookModel
        .findById(bookId)
        .populate('author', 'name')
        .select('-__v')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookRead) return [200, {
        message: 'no book fetched',
        detail: 'book not found'
    }]

    if (bookRead?.err) return [bookRead.status, bookRead.err]

    return [200, {
        message: 'book fetched',
        detail: bookRead
    }]
}


books.readAll = async () => { // OK

    const booksRead = await bookModel
        .find()
        .populate('author', 'name')
        .select('-__v')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (booksRead.length === 0) return [200, {
        message: 'no book fetched',
        detail: 'empty library'
    }]

    if (booksRead?.err) return [booksRead.status, booksRead.err]

    return [200, {
        message: 'books fetched',
        detail: booksRead
    }]
}


books.updateOne = async (id, bookData) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const authorDataRead = await authorModel
        .findOne({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (authorDataRead?.err) return [authorDataRead.status, authorDataRead.err]


    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (authorData?.err) return [authorData.status, authorData.err]


    const bookId = mongoose.Types.ObjectId(id)

    const bookUpdated = await bookModel
        .findByIdAndUpdate(bookId, { ...bookData, author: authorData._id }, { new: true })
        .populate('author', 'name')
        .select('-__v')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookUpdated) return [200, {
        message: 'no book updated',
        detail: 'book not found'
    }]

    if (bookUpdated?.err) return [bookUpdated.status, bookUpdated.err]

    return [200, {
        message: 'book updated',
        detail: bookUpdated
    }]
}


books.deleteOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const bookId = mongoose.Types.ObjectId(id)

    const bookDeleted = await bookModel
        .findByIdAndDelete(bookId)
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookDeleted) return [200, {
        message: 'no book deleted',
        detail: 'book not found'
    }]

    if (bookDeleted?.err) return [bookDeleted.status, bookDeleted.err]

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

    if (booksDeleted?.err) return [booksDeleted.status, booksDeleted.err]


    const authorsDeleted = await authorModel
        .deleteMany()
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (authorsDeleted?.err) return [authorsDeleted.status, authorsDeleted.err]


    return [200, {
        message: 'books and authors deleted',
        detail: {
            booksDeleted,
            authorsDeleted
        }
    }]
}


const errorHelper = (status, err) => {
    return {
        status,
        err
    }
}

module.exports = books