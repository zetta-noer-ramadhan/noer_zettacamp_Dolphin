const mongoose = require('mongoose')
const authorModel = require('../model/author.model')
const bookModel = require('../model/book.model')

const CreateOne = async (bookData) => { // OK

    if (!bookData || typeof bookData !== 'object' || !bookData.author || typeof bookData.author !== 'string') {
        return [400, { message: 'bad book data 1' }]
    }

    const requiredField = ['title', 'author', 'price', 'genre', 'on_sale']

    let isFieldNotExist = false
    requiredField.forEach(field => {
        if (typeof bookData[field] === 'object' && !bookData[field].length) isFieldNotExist = true
        if (bookData[field] === undefined || bookData[field] === null) isFieldNotExist = true
    })

    if (isFieldNotExist) return [400, { message: 'bad book data 2' }]

    const authorDataRead = await authorModel
        .findOne({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorDataRead && authorDataRead.err) return [authorDataRead.status, authorDataRead.err]


    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author_id })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorData && authorData.err) return [authorData.status, authorData.err]

    if (!authorData || !authorData._id) return [500, { message: 'something happened when creating author data' }]

    const bookCreated = await bookModel
        .create({ ...bookData, author_id: authorData._id })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookCreated && bookCreated.err) return [bookCreated.status, bookCreated.err]

    if (!bookCreated || !bookCreated._id) return [500, { message: 'something happened when creating book data' }]

    authorData.books_id.push(bookCreated._id)
    const savingData = await authorData
        .save()
        .catch(err => ({ status: 500, err }))

    if (savingData && savingData.err) return [savingData.status, savingData.err]


    return [200, bookCreated]
}

const CreateMany = async (booksData) => { // OK

    if (!booksData || typeof booksData !== 'object' || !booksData.length) return [400, { message: 'bad books data 1' }]

    let data = []

    for (let bookData of booksData) {

        if (!bookData || typeof bookData !== 'object' || !bookData.author || typeof bookData.author !== 'string') {
            return [400, { message: 'bad book data 2' }]
        }

        const requiredField = ['title', 'author', 'price', 'genre', 'on_sale']

        let isFieldNotExist = false
        requiredField.forEach(field => {
            if (typeof bookData[field] === 'object' && !bookData[field].length) isFieldNotExist = true
            if (bookData[field] === undefined || bookData[field] === null) isFieldNotExist = true
        })

        if (isFieldNotExist) return [400, { message: 'bad book data 3' }]

        const authorDataRead = await authorModel
            .findOne({ name: bookData.author })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (authorDataRead && authorDataRead.err) return [authorDataRead.status, authorDataRead.err]

        const authorData = authorDataRead || await authorModel
            .create({ name: bookData.author })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (authorData && authorData.err) return [authorData.status, authorData.err]

        if (!authorData || !authorData._id) return [500, { message: 'something happened when creating author data' }]

        const bookCreated = await bookModel
            .create({ ...bookData, author_id: authorData._id })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (bookCreated && bookCreated.err) return [bookCreated.status, bookCreated.err]

        if (!bookCreated || !bookCreated._id) return [500, { message: 'something happened when creating book data' }]

        authorData.books_id.push(bookCreated._id)
        const savingData = await authorData
            .save()
            .catch(err => ({ status: 500, err }))

        if (savingData && savingData.err) return [savingData.status, savingData.err]

        const newBook = await bookModel
            .findById(bookCreated._id)
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        data.push(newBook)
    }

    if (!data || !data.length) return [500, { message: 'something happened when creating books data' }]

    return [200, data]
}

const GetOne = async (bookId) => { // OK

    if (!bookId || typeof bookId !== 'string') return [400, { message: 'no book id' }]

    const isValidID = mongoose.Types.ObjectId.isValid(bookId)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const validBookId = mongoose.Types.ObjectId(bookId)
    if (!validBookId) return [400, { message: 'something happened when casting object id' }]

    const bookRead = await bookModel
        .findById(validBookId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookRead && bookRead.err) return [bookRead.status, bookRead.err]

    return [200, bookRead]
}

const GetMany = async () => { // OK

    const booksRead = await bookModel
        .find()
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (booksRead && booksRead.err) return [booksRead.status, booksRead.err]

    if (!booksRead) return [500, { message: 'something happened when calling book.getMany' }]

    return [200, booksRead]
}

const GetManyByIds = async (bookIds) => { // OK

    if (!bookIds || typeof bookIds !== 'object' || !bookIds.length) return ({ status: 400, message: 'no book' })

    const validBooksIds = bookIds.map(bookId => {

        if (!bookId) return null

        const isValidID = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValidID) return null

        const validAuthorId = mongoose.Types.ObjectId(bookId)
        if (!validAuthorId) return [400, { message: 'something happened when casting object id' }]
        return validAuthorId
    })

    if (!validBooksIds) return [400, { message: 'no books ids' }]

    const data = await bookModel
        .find({ _id: { $in: validBooksIds } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data && data.err) return [data.status, data.err]

    return [200, data]
}

const UpdateOne = async (bookId, bookData) => { // OK


    if (!bookId || typeof bookId !== 'string') return [400, { message: 'no book id' }]

    const isValidID = mongoose.Types.ObjectId.isValid(bookId)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    if (!bookData) return ({ status: 400, message: 'bad book data' })

    const sample = {...bookData}
    console.log(sample)
    console.log(sample.author)
    if (!sample.author) return ({ status: 400, message: 'bad book data' })

    const { author } = bookData
    if (!author) return ({ status: 400, message: 'bad book data' })


    const authorDataRead = await authorModel
        .findOne({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorDataRead && authorDataRead.err) return [authorDataRead.status, authorDataRead.err]


    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorData && authorData.err) return [authorData.status, authorData.err]

    if (!authorData || !authorData._id) return ({ status: 500, message: 'something happened when creating author data' })


    const validBookId = mongoose.Types.ObjectId(bookId)
    if (!validBookId) return [400, { message: 'something happened when casting object id' }]

    const bookUpdated = await bookModel
        .findByIdAndUpdate(validBookId, { ...bookData, author_id: authorData._id }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookUpdated && bookUpdated.err) return [bookUpdated.status, bookUpdated.err]

    return [200, bookUpdated]
}

const DeleteOne = async (bookId) => { // OK

    if (!bookId || typeof bookId !== 'string') return ({ status: 400, message: 'no book id' })

    const isValidID = mongoose.Types.ObjectId.isValid(bookId)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const validBookId = mongoose.Types.ObjectId(bookId)
    if (!validBookId) return [400, { message: 'something happened when casting object id' }]

    const bookDeleted = await bookModel
        .findByIdAndDelete(validBookId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookDeleted && bookDeleted.err) return [bookDeleted.status, bookDeleted.err]

    return [200, bookDeleted]
}













// NOT USED ON GRAPHQL

// const Projection = async (fields) => {

//     const fieldData = fields
//         ? Object.entries(fields).map(([, value]) => ([value, 1]))
//         : [['x', 0]]

//     const fieldDataObject = Object.fromEntries(fieldData)

//     const projectedData = await bookModel
//         .aggregate([
//             {
//                 $project: {
//                     ...fieldDataObject,
//                     newField: 'wow!',
//                     price: {
//                         $add: [12, 10]
//                     },
//                     year: 1
//                 }
//             },
//             { $project: { __v: 0 } },
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (projectedData.err) return [projectedData.status, projectedData.err]

//     return [200, projectedData]
// }

// const AddFields = async () => {

//     const addedData = await bookModel
//         .aggregate([
//             {
//                 $lookup: {
//                     from: 'authors',
//                     localField: 'author',
//                     foreignField: '_id',
//                     as: 'author'
//                 }
//             },
//             {
//                 $addFields: {
//                     priceValue: {
//                         $cond: {
//                             if: {
//                                 $gt: ['$price', 50000]
//                             },
//                             then: 'Expensive',
//                             else: 'Inexpensive'
//                         }
//                     },
//                     stock: 1,
//                     on_sale: true,
//                     authorName: {
//                         $arrayElemAt: ['$author.name', 0]
//                     }
//                 },
//             },
//             {
//                 $project: {
//                     __v: 0,
//                     author: 0
//                 }
//             }
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (addedData.err) return [addedData.status, addedData.err]

//     return [200, addedData]
// }

// const AddFieldsOne = async (bookId) => {

//     const isValidID = mongoose.Types.ObjectId.isValid(bookId)
//     if (!isValidID) return [400, { message: 'invalid ID' }]

//     const validBookId = mongoose.Types.ObjectId(bookId)

//     const addedData = await bookModel
//         .aggregate([
//             { $match: { _id: validBookId } },
//             {
//                 $lookup: {
//                     from: 'authors',
//                     localField: 'author',
//                     foreignField: '_id',
//                     as: 'author'
//                 }
//             },
//             {
//                 $addFields: {
//                     priceValue: {
//                         $cond: {
//                             if: {
//                                 $gt: ['$price', 50000]
//                             },
//                             then: 'Expensive',
//                             else: 'Inexpensive'
//                         }
//                     },
//                     stock: 1,
//                     on_sale: true,
//                     authorName: {
//                         $arrayElemAt: ['$author.name', 0]
//                     }
//                 },
//             },
//             {
//                 $project: {
//                     __v: 0,
//                     author: 0
//                 }
//             }
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (addedData.err) return [addedData.status, addedData.err]

//     return [200, addedData]
// }

// const Aggregate = async (matchFields, sortFields) => {

//     const data = await bookModel
//         .aggregate([
//             {
//                 $lookup: {
//                     from: 'authors',
//                     localField: 'author',
//                     foreignField: '_id',
//                     as: 'author'
//                 }
//             },
//             { $match: matchFields },
//             { $sort: sortFields },
//             {
//                 $addFields: {
//                     book_id: '$_id',
//                     short_introduction: {
//                         $concat: ['$title', ' by ', {
//                             $arrayElemAt: ['$author.name', 0]
//                         }]
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     bookId: 1,
//                     short_introduction: 1,
//                     genre: 1,
//                     price: {
//                         $concat: ['Rp', {
//                             $toString: '$price'
//                         }]
//                     }
//                 }
//             }
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (data.err) return [data.status, data.err]

//     return [200, data]
// }

// const Sort = async () => {
//     // return [200, await bookModel.distinct('title')]
//     const data = await bookModel
//         .aggregate([
//             {
//                 $lookup: {
//                     from: 'authors',
//                     localField: 'author',
//                     foreignField: '_id',
//                     as: 'author'
//                 }
//             },
//             {
//                 $addFields: {
//                     author: {
//                         $arrayElemAt: ['$author.name', 0]
//                     }
//                 }
//             },
//             {
//                 $sort: {
//                     title: 1,
//                     _id: 1
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     title: 1,
//                     // author: 1,
//                     // genre: 1
//                 }
//             }
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (data.err) return [data.status, data.err]

//     return [200, data]
// }

// const Pagination = async (size, page) => {
//     const pageLimit = +size
//     const pageSkip = +(page) - 1

//     if (page < 1) return [400, {
//         message: 'page query must be greater than or equal to one'
//     }]

//     const data = await bookModel
//         .aggregate([
//             { $project: { __v: 0 } },
//             {
//                 $lookup: {
//                     from: 'authors',
//                     localField: 'author',
//                     foreignField: '_id',
//                     as: 'author'
//                 }
//             },
//             {
//                 $addFields: {
//                     author: { $arrayElemAt: ['$author.name', 0] },
//                     bookInfo: {
//                         $concat: ['$title', ' by ', {
//                             $arrayElemAt: ['$author.name', 0]
//                         }]
//                     },
//                 }
//             },
//             { $sort: { title: 1, _id: 1 } },

//             {
//                 $facet: {

//                     totalBooksAllPages: [
//                         {
//                             $group: {
//                                 _id: null,
//                                 books: { $sum: 1 }
//                             }
//                         },
//                         { $project: { _id: 0, books: 1 } }
//                     ],


//                     currentPage: [
//                         { $skip: pageLimit * pageSkip },
//                         { $limit: pageLimit },
//                         {
//                             $group: {
//                                 _id: null,
//                                 totalBooksPerPage: { $sum: 1 },
//                                 totalPricePerPage: { $sum: '$price' },
//                                 authors: { $addToSet: '$author' }
//                             }
//                         },
//                         { $addFields: { page: pageSkip + 1 } },
//                         {
//                             $project: {
//                                 _id: 0,
//                                 page: 1,
//                                 totalBooksPerPage: 1,
//                                 totalPricePerPage: 1,
//                                 authors: 1
//                             }
//                         }
//                     ],


//                     pagination: [
//                         { $skip: pageLimit * pageSkip },
//                         { $limit: pageLimit },
//                         {
//                             $project: {
//                                 _id: 0,
//                                 title: 1,
//                                 author: 1,
//                                 price: 1,
//                                 genre: 1,
//                             }
//                         }
//                     ],


//                     groupByAuthor: [
//                         { $skip: pageLimit * pageSkip },
//                         { $limit: pageLimit },
//                         {
//                             $group: {
//                                 _id: '$author',
//                                 data: { $push: '$$ROOT' },
//                                 totalBooks: { $sum: 1 }
//                             }
//                         },
//                         { $sort: { _id: 1, 'data.title': 1 } },
//                         {
//                             $project: {
//                                 data: {
//                                     bookInfo: 1,
//                                     price: 1
//                                 },
//                                 totalBooks: 1
//                             }
//                         }
//                     ],


//                     groupByGenre: [
//                         { $skip: pageLimit * pageSkip },
//                         { $limit: pageLimit },
//                         { $addFields: { genres: '$genre' } },
//                         { $unwind: { path: '$genres' } },
//                         {
//                             $group: {
//                                 _id: '$genres',
//                                 data: { $push: '$$ROOT' },
//                                 totalBooks: { $sum: 1 }
//                             }
//                         },
//                         { $sort: { _id: 1, 'data.title': 1 } },
//                         {
//                             $project: {
//                                 data: {
//                                     bookInfo: 1,
//                                     genre: 1
//                                 },
//                                 totalBooks: 1
//                             }
//                         },
//                     ]
//                 }
//             },

//             // {
//             //     $addFields: {
//             //         pageInfo: {
//             //             currentPage: { $arrayElemAt: ["$currentPage", 0] },
//             //             totalBooksAllPages: { $arrayElemAt: ["$totalBooksAllPages.books", 0] }
//             //         }
//             //     }
//             // },
//             // {
//             //     $project: {
//             //         currentPage: 0,
//             //         totalBooksAllPages: 0
//             //     }
//             // }
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (data.err) return [data.status, data.err]
//     if (data[0].pagination.length === 0) return [200, {
//         message: 'no data'
//     }]

//     return [200, data]
// }

module.exports = {
    CreateOne,
    CreateMany,
    GetOne,
    GetMany,
    GetManyByIds,
    UpdateOne,
    DeleteOne,
    // Projection,
    // AddFields,
    // AddFieldsOne,
    // Aggregate,
    // Sort,
    // Pagination
}