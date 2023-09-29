const mongoose = require('mongoose')
const authorModel = require('../model/author.model')
const bookModel = require('../model/book.model')

const books = {}

books.createOne = async (bookData) => { // OK

    const authorDataRead = await authorModel
        .findOne({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorDataRead?.err) return [authorDataRead.status, authorDataRead.err]


    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorData?.err) return [authorData.status, authorData.err]


    const bookCreated = await bookModel
        .create({ ...bookData, author: authorData._id })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookCreated?.err) return [bookCreated.status, bookCreated.err]


    authorData.books.push(bookCreated._id)
    const savingData = await authorData
        .save()
        .catch(err => ({ status: 500, err }))

    if (savingData?.err) return [savingData.status, savingData.err]


    return [201, bookCreated]
    return [201, {
        message: 'book added',
        detail: {
            bookCreated,
            authorData
        }
    }]
}

books.createMany = async (booksData) => {

    let data = []

    for (let bookData of booksData) {

        const authorDataRead = await authorModel
            .findOne({ name: bookData.author })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (authorDataRead?.err) return [authorDataRead.status, authorDataRead.err]

        const authorData = authorDataRead || await authorModel
            .create({ name: bookData.author })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (authorData?.err) return [authorData.status, authorData.err]

        const bookCreated = await bookModel
            .create({ ...bookData, author: authorData._id })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (bookCreated?.err) return [bookCreated.status, bookCreated.err]


        authorData.books.push(bookCreated._id)
        const savingData = await authorData
            .save()
            .catch(err => ({ status: 500, err }))

        if (savingData?.err) return [savingData.status, savingData.err]

        const newBook = await bookModel
            .findById(bookCreated._id)
            .populate('author', 'name')
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        data.push(newBook)
    }

    return [200, data]
}

books.readOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const bookId = mongoose.Types.ObjectId(id)

    const bookRead = await bookModel
        .findById(bookId)
        .populate('author', 'name')
        .select('-__v')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    // if (!bookRead) return [200, {
    //     message: 'no book fetched',
    //     detail: 'book not found'
    // }]

    if (bookRead?.err) return [bookRead.status, bookRead.err]

    return [200, bookRead]
}

books.readAll = async () => { // OK

    const booksRead = await bookModel
        .find()
        .populate('author', 'name')
        .select('-__v')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    // if (booksRead.length === 0) return [200, {
    //     message: 'no book fetched',
    //     detail: 'empty library'
    // }]

    if (booksRead?.err) return [booksRead.status, booksRead.err]

    return [200, booksRead]
}

books.updateOne = async (id, bookData) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const authorDataRead = await authorModel
        .findOne({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorDataRead?.err) return [authorDataRead.status, authorDataRead.err]


    const authorData = authorDataRead || await authorModel
        .create({ name: bookData.author })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (authorData?.err) return [authorData.status, authorData.err]


    const bookId = mongoose.Types.ObjectId(id)

    const bookUpdated = await bookModel
        .findByIdAndUpdate(bookId, { ...bookData, author: authorData._id }, { new: true })
        .populate('author', 'name')
        .select('-__v')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (!bookUpdated) return [200, {
        message: 'no book updated',
        detail: 'book not found'
    }]

    if (bookUpdated?.err) return [bookUpdated.status, bookUpdated.err]

    return [200, bookUpdated]
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
        .catch(err => ({ status: 500, err }))
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
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (booksDeleted?.err) return [booksDeleted.status, booksDeleted.err]


    const authorsDeleted = await authorModel
        .deleteMany()
        .catch(err => ({ status: 500, err }))
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




books.projection = async (fields) => {

    const fieldData = fields
        ? Object.entries(fields).map(([_, value]) => ([value, 1]))
        : [["x", 0]]

    const fieldDataObject = Object.fromEntries(fieldData)

    const projectedData = await bookModel
        .aggregate([
            {
                $project: {
                    ...fieldDataObject,
                    newField: 'wow!',
                    price: {
                        $add: [12, 10]
                    },
                    year: 1
                }
            },
            { $project: { __v: 0 } },
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (projectedData?.err) return [projectedData.status, projectedData.err]

    return [200, projectedData]
}

books.addFields = async () => {

    const addedData = await bookModel
        .aggregate([
            {
                $lookup: {
                    from: "authors",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $addFields: {
                    priceValue: {
                        $cond: {
                            if: {
                                $gt: ['$price', 50000]
                            },
                            then: "Expensive",
                            else: "Inexpensive"
                        }
                    },
                    stock: 1,
                    on_sale: true,
                    authorName: {
                        $arrayElemAt: ['$author.name', 0]
                    }
                },
            },
            {
                $project: {
                    __v: 0,
                    author: 0
                }
            }
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (addedData?.err) return [addedData.status, addedData.err]

    return [200, addedData]
}

books.addFieldsOne = async (bookId) => {

    const isValidID = mongoose.Types.ObjectId.isValid(bookId)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const validBookId = mongoose.Types.ObjectId(bookId)

    const addedData = await bookModel
        .aggregate([
            { $match: { _id: validBookId } },
            {
                $lookup: {
                    from: "authors",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $addFields: {
                    priceValue: {
                        $cond: {
                            if: {
                                $gt: ['$price', 50000]
                            },
                            then: "Expensive",
                            else: "Inexpensive"
                        }
                    },
                    stock: 1,
                    on_sale: true,
                    authorName: {
                        $arrayElemAt: ['$author.name', 0]
                    }
                },
            },
            {
                $project: {
                    __v: 0,
                    author: 0
                }
            }
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (addedData?.err) return [addedData.status, addedData.err]

    return [200, addedData]
}



books.aggregate = async (matchFields, sortFields) => {

    const data = await bookModel
        .aggregate([
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $match: matchFields },
            { $sort: sortFields },
            {
                $addFields: {
                    book_id: "$_id",
                    short_introduction: {
                        $concat: ['$title', ' by ', {
                            $arrayElemAt: ["$author.name", 0]
                        }]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    bookId: 1,
                    short_introduction: 1,
                    genre: 1,
                    price: {
                        $concat: ['Rp', {
                            $toString: "$price"
                        }]
                    }
                }
            }
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}



books.sort = async () => {
    // return [200, await bookModel.distinct('title')]
    const data = await bookModel
        .aggregate([
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $addFields: {
                    author: {
                        $arrayElemAt: ['$author.name', 0]
                    }
                }
            },
            {
                $sort: {
                    title: 1,
                    _id: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    // author: 1,
                    // genre: 1
                }
            }
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}

books.pagination = async (size, page) => {
    const pageLimit = +size
    const pageSkip = +(page) - 1

    if (page < 1) return [400, {
        message: 'page query must be greater than or equal to one'
    }]

    const data = await bookModel
        .aggregate([
            { $project: { __v: 0 } },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $addFields: {
                    author: { $arrayElemAt: ["$author.name", 0] },
                    bookInfo: {
                        $concat: ['$title', ' by ', {
                            $arrayElemAt: ['$author.name', 0]
                        }]
                    },
                }
            },
            { $sort: { title: 1, _id: 1 } },

            {
                $facet: {

                    totalBooksAllPages: [
                        {
                            $group: {
                                _id: null,
                                books: { $sum: 1 }
                            }
                        },
                        { $project: { _id: 0, books: 1 } }
                    ],


                    currentPage: [
                        { $skip: pageLimit * pageSkip },
                        { $limit: pageLimit },
                        {
                            $group: {
                                _id: null,
                                totalBooksPerPage: { $sum: 1 },
                                totalPricePerPage: { $sum: "$price" },
                                authors: { $addToSet: "$author" }
                            }
                        },
                        { $addFields: { page: pageSkip + 1 } },
                        {
                            $project: {
                                _id: 0,
                                page: 1,
                                totalBooksPerPage: 1,
                                totalPricePerPage: 1,
                                authors: 1
                            }
                        }
                    ],


                    pagination: [
                        { $skip: pageLimit * pageSkip },
                        { $limit: pageLimit },
                        {
                            $project: {
                                _id: 0,
                                title: 1,
                                author: 1,
                                price: 1,
                                genre: 1,
                            }
                        }
                    ],


                    groupByAuthor: [
                        { $skip: pageLimit * pageSkip },
                        { $limit: pageLimit },
                        {
                            $group: {
                                _id: '$author',
                                data: { $push: "$$ROOT" },
                                totalBooks: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1, 'data.title': 1 } },
                        {
                            $project: {
                                data: {
                                    bookInfo: 1,
                                    price: 1
                                },
                                totalBooks: 1
                            }
                        }
                    ],


                    groupByGenre: [
                        { $skip: pageLimit * pageSkip },
                        { $limit: pageLimit },
                        { $addFields: { genres: '$genre' } },
                        { $unwind: { path: '$genres' } },
                        {
                            $group: {
                                _id: "$genres",
                                data: { $push: "$$ROOT" },
                                totalBooks: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1, 'data.title': 1 } },
                        {
                            $project: {
                                data: {
                                    bookInfo: 1,
                                    genre: 1
                                },
                                totalBooks: 1
                            }
                        },
                    ]
                }
            },

            // {
            //     $addFields: {
            //         pageInfo: {
            //             currentPage: { $arrayElemAt: ["$currentPage", 0] },
            //             totalBooksAllPages: { $arrayElemAt: ["$totalBooksAllPages.books", 0] }
            //         }
            //     }
            // },
            // {
            //     $project: {
            //         currentPage: 0,
            //         totalBooksAllPages: 0
            //     }
            // }
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]
    if (data[0].pagination.length === 0) return [200, {
        message: 'no data'
    }]

    return [200, data]
}

module.exports = books