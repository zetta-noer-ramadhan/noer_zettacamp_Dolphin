const mongoose = require('mongoose')
const bookModel = require('../model/book.model')
const bookshelfModel = require('../model/bookshelf.model')

const CreateOne = async (bookshelfName) => { // OK

    if (!bookshelfName) return ({ status: 400, message: 'no bookshelf name' })

    const bookshelfData = await bookshelfModel
        .create({ name: bookshelfName, books_id: [], genres: [], officers_id: [] })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData && bookshelfData.err) return [bookshelfData.status, bookshelfData.err]

    return [200, bookshelfData]
}

const CreateMany = async (bookshelvesData) => { // OK

    if (!bookshelvesData || !bookshelvesData.length) return ({ status: 400, message: 'no bookshelves data' })

    let data = []

    for (let bookshelfData of bookshelvesData) {

        if (!bookshelfData || !bookshelfData.name) return ({ status: 400, message: 'no bookshelf name' })

        const createdBookshelf = await bookshelfModel
            .create({ name: bookshelfData.name, books_id: [], genres: [], officers_id: [] })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (createdBookshelf && createdBookshelf.err) return [createdBookshelf.status, createdBookshelf.err]

        data.push(createdBookshelf)
    }

    if (!data || !data.length) return [500, { message: 'something happened when creating bookshelf data' }]

    return [200, data]
}

const Insert = async (bookshelfId, { bookIds }) => {

    if (!bookshelfId) return [400, { message: 'no bookshelf id' }]
    if (!bookIds || !bookIds.length) return [400, { message: 'no books id' }]

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
    if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]

    const bookshelfData = await bookshelfModel
        .findOne({ _id: validBookshelfId })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData && bookshelfData.err) return [bookshelfData.status, bookshelfData.err]

    for (let bookId of bookIds) {

        console.log('insert', bookId)

        const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isBookIdValid) return [400, { message: 'invalid book id' }]

        const validBookId = mongoose.Types.ObjectId(bookId)
        if (!validBookId) return [400, { message: 'something happened when casting object id' }]

        const bookRead = await bookModel
            .find({ _id: validBookId })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (bookRead && bookRead.err) return [bookRead.status, bookRead.err]

        if (!bookRead) return [400, { message: 'book id not exist' }]

        const currentBookGenre = [...bookshelfData.genres, ...bookRead[0].genre]

        const insertedData = await bookshelfModel
            .updateOne({ _id: validBookshelfId },
                {
                    $addToSet: { books_id: validBookId },
                    $push: { genres: currentBookGenre }
                })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (insertedData && insertedData.err) return [insertedData.status, insertedData.err]

        const bookshelfSave = await bookshelfData
            .save()
            .catch(err => ({ status: 500, err }))

        if (bookshelfSave && bookshelfSave.err) return [bookshelfSave.status, bookshelfSave.err]
    }

    console.log('finish')
    console.log(bookshelfData)
    return [200, bookshelfData]
}

const GetOne = async (bookshelfId) => {

    const isValidId = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isValidId) return [400, { message: 'invalid id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
    if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]

    const bookshelfData = await bookshelfModel
        .findOne({ _id: validBookshelfId })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData && bookshelfData.err) return [bookshelfData.status, bookshelfData.err]

    return [200, bookshelfData]
}

const GetMany = async () => {

    const bookshelfData = await bookshelfModel
        .find()
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData && bookshelfData.err) return [bookshelfData.status, bookshelfData.err]

    return [200, bookshelfData]
}

const GetManyByBookId = async (bookId) => {
    let filter = {}

    if (bookId) {
        const isValidID = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValidID) return [400, { message: 'invalid ID' }]

        const validBookId = mongoose.Types.ObjectId(bookId)
        if (!validBookId) return [400, { message: 'something happened when casting object id' }]

        filter = {
            books_id: {
                $in: [validBookId]
            }
        }
    }

    const bookshelfData = await bookshelfModel
        .find(filter)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData && bookshelfData.err) return [bookshelfData.status, bookshelfData.err]

    return [200, bookshelfData]
}

const GetManyByIds = async (bookshelvesIds) => {

    if (!bookshelvesIds || bookshelvesIds.length < 1) return ({ status: 400, message: 'no author' })

    const validBookshelvesIds = bookshelvesIds.map(bookshelfId => {

        if (!bookshelfId) return null

        const isValidID = mongoose.Types.ObjectId.isValid(bookshelfId)
        if (!isValidID) return null

        const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
        if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]
        return validBookshelfId
    })

    if (!validBookshelvesIds) return [400, { message: 'no bookshelves id' }]

    const data = await bookshelfModel
        .find({ _id: { $in: validBookshelvesIds } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data && data.err) return [data.status, data.err]

    return [200, data]
}

const UpdateOne = async (bookshelfId, bookshelfData) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
    if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]

    const updatedBookshelf = await bookshelfModel
        .findByIdAndUpdate(validBookshelfId, { ...bookshelfData }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (updatedBookshelf && updatedBookshelf.err) return [updatedBookshelf.status, updatedBookshelf.err]

    return [200, updatedBookshelf]
}

const DeleteOne = async (bookshelfId) => {

    const isValidId = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isValidId) return [400, { message: 'invalid id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
    if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]

    const deletedBookshelf = await bookshelfModel
        .findByIdAndDelete(validBookshelfId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (deletedBookshelf && deletedBookshelf.err) return [deletedBookshelf.status, deletedBookshelf.err]

    return [200, deletedBookshelf]
}

const RemoveOne = async (bookshelfId, bookId) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
    if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]

    const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
    if (!isBookIdValid) return [400, { message: 'invalid book id' }]

    const validBookId = mongoose.Types.ObjectId(bookId)
    if (!validBookId) return [400, { message: 'something happened when casting object id' }]

    const removed = await bookshelfModel
        .findByIdAndUpdate(validBookshelfId, { $pull: { books_id: { $in: validBookId } } }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removed && removed.err) return [removed.status, removed.err]

    return [200, removed]
}

const RemoveMany = async (bookshelfId) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)
    if (!validBookshelfId) return [400, { message: 'something happened when casting object id' }]

    const removed = await bookshelfModel
        .findByIdAndUpdate(validBookshelfId, { $set: { books_id: [] } }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removed && removed.err) return [removed.status, removed.err]

    return [200, removed]
}













// NOT USED ON GRAPHQL


// const GetBookshelvesFilter = async (bookId) => {
//     const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
//     if (!isBookIdValid) return [400, { message: 'invalid book id' }]

//     const validBookId = mongoose.Types.ObjectId(bookId)

//     const bookshelvesData = await bookshelfModel
//         .find({ books: { $eq: validBookId } })
//         .populate({
//             path: 'books',
//             select: '-__v',
//             populate: {
//                 path: 'author',
//                 model: 'Author',
//                 select: 'name'
//             }
//         })
//         .select('-__v')
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (bookshelvesData.err) return [bookshelvesData.status, bookshelvesData.err]

//     if (bookshelvesData.length === 0) return [200, {
//         message: 'no bookshelves fetched',
//         detail: 'empty library'
//     }]

//     return [200, bookshelvesData]
//     // return [200, {
//     //     message: 'bookshelves fetched',
//     //     detail: bookshelvesData
//     // }]
// }

// const GetBooksFilter = async (bookIds) => {

//     const validBookIds = []

//     for (let bookId of bookIds) {
//         const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
//         if (!isBookIdValid) return [400, { message: 'invalid book id' }]

//         const validBookId = mongoose.Types.ObjectId(bookId)

//         const bookRead = await bookModel
//             .find({ _id: validBookId })
//             .catch(err => ({ status: 500, err }))
//             .then(data => data)

//         if (bookRead.err) return [bookRead.status, bookRead.err]

//         if (!bookRead) return [400, { message: 'book id not exist' }]

//         validBookIds.push(validBookId)
//     }

//     const bookshelvesData = await bookshelfModel
//         .find({ books: { $in: validBookIds } })
//         .populate({
//             path: 'books',
//             select: '-__v',
//             populate: {
//                 path: 'author',
//                 model: 'Author',
//                 select: 'name'
//             }
//         })
//         .select('-__v')
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (bookshelvesData.err) return [bookshelvesData.status, bookshelvesData.err]

//     if (bookshelvesData.length === 0) return [200, {
//         message: 'no bookshelves fetched',
//         detail: 'empty library'
//     }]

//     return [200, bookshelvesData]
//     // return [200, {
//     //     message: 'filter result',
//     //     detail: bookshelvesData
//     // }]
// }

// const Update = async (bookshelfId, bookshelfName) => {

//     const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
//     if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

//     const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

//     const bookshelfData = await bookshelfModel
//         .updateOne({ _id: validBookshelfId }, { $set: { name: bookshelfName } })
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (bookshelfData.err) return [bookshelfData.status, bookshelfData.err]

//     if (!bookshelfData) return [200, {
//         message: 'no bookshelf fetched',
//         detail: 'bookshelf not found'
//     }]

//     return [200, bookshelfData]
//     // return [200, {
//     //     message: 'bookshelf fetched',
//     //     detail: bookshelfData
//     // }]
// }

// const ElemMatch = async (officerName, officerAge) => {

//     const matchData = await bookshelfModel
//         .find({
//             officer: {
//                 $elemMatch: {
//                     name: officerName,
//                     age: officerAge
//                 }
//             }
//         })
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (matchData.err) return [matchData.status, matchData.err]
//     if (matchData.length === 0) return [200, { message: 'filter match nothing' }]

//     return [200, matchData]
// }

// const ArrayFilters = async (bookshelfId, officerName, officerAge) => {

//     const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
//     if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

//     const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

//     const updatedData = await bookshelfModel
//         .updateMany(
//             { _id: validBookshelfId },
//             {
//                 $set: {
//                     'officer.$[x].name': officerName
//                 }
//             },
//             {
//                 arrayFilters: [{
//                     'x.age': officerAge
//                 }]
//             }
//         )
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (updatedData.err) return [updatedData.status, updatedData.err]

//     const { ok, nModified } = updatedData

//     if (!ok) return [500, { message: 'something is wrong' }]
//     if (nModified !== 1) return [200, { message: 'no data updated' }]

//     return [200, { message: 'data successfully updated' }]
// }

// const Distinct = async (bookshelfId) => {

//     const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
//     if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

//     const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

//     const distinctData = await bookshelfModel
//         .distinct('genres', { _id: validBookshelfId })
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (distinctData.err) return [distinctData.status, distinctData.err]

//     const bookGenre = await bookModel
//         .distinct('genre')
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (bookGenre.err) return [bookGenre.status, bookGenre.err]

//     return [200, distinctData]

//     // return [200, {
//     //     bookshelvesGenre: distinctData,
//     //     bookGenre: bookGenre
//     // }]
// }

// const Unwind = async (bookshelfId) => {

//     const isValidId = mongoose.Types.ObjectId.isValid(bookshelfId)
//     if (!isValidId) return [400, { message: 'invalid id' }]

//     const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

//     const unwindedData = await bookshelfModel
//         .aggregate([
//             { $match: { _id: validBookshelfId } },
//             { $unwind: { path: '$books' } },
//             {
//                 $lookup: {
//                     from: 'books',
//                     let: { currentBookId: '$books' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$_id', '$$currentBookId'] } } },
//                         {
//                             $lookup: {
//                                 from: 'authors',
//                                 let: { currentAuthorId: '$author' },
//                                 pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$currentAuthorId'] } } }],
//                                 as: 'authorData'
//                             }
//                         }
//                     ],
//                     as: 'book'
//                 }
//             },
//             {
//                 $addFields: {
//                     bookshelfLocation: '$name',
//                     bookData: '$book',
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     __v: 0,
//                     name: 0,
//                     officer: 0,
//                     genres: 0,
//                     book: 0,
//                     bookData: {
//                         __v: 0,
//                         genre: 0,
//                         price: 0,
//                         on_sale: 0,
//                         authorData: {
//                             __v: 0,
//                             books: 0
//                         }
//                     }
//                 }
//             },
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (unwindedData.err) return [unwindedData.status, unwindedData.err]

//     return [200, unwindedData]
// }

// const Aggregate = async (bookshelfId) => {

//     const isValidId = mongoose.Types.ObjectId.isValid(bookshelfId)
//     if (!isValidId) return [400, { message: 'invalid id' }]

//     const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

//     const data = await bookshelfModel
//         .aggregate([
//             { $match: { _id: validBookshelfId } },
//             {
//                 $lookup: {
//                     from: 'books',
//                     localField: 'books',
//                     foreignField: '_id',
//                     as: 'books'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'authors',
//                     localField: 'books.author',
//                     foreignField: '_id',
//                     as: 'author'
//                 }
//             },
//             {
//                 $addFields: {
//                     'books.author': '$author'
//                 }
//             }
//         ])
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (data.err) return [data.status, data.err]

//     return [200, data]
// }

module.exports = {
    CreateOne,
    CreateMany,
    Insert,
    // GetBookshelvesFilter,
    // GetBooksFilter,
    GetOne,
    GetMany,
    GetManyByIds,
    GetManyByBookId,
    // Update,
    UpdateOne,
    DeleteOne,
    RemoveOne,
    RemoveMany,
    // ElemMatch,
    // ArrayFilters,
    // Distinct,
    // Unwind,
    // Aggregate
}