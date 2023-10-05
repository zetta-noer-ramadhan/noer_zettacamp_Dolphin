const mongoose = require('mongoose')
const authorModel = require('../model/author.model')

const GetMany = async () => { // OK

    const data = await authorModel
        .find({})
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (!data) return [500, { message: 'something wrong when calling author model' }]

    return [data.status || 200, data]
}

const GetManyByIds = async (authorIds) => { // OK

    if (!authorIds || typeof authorIds !== 'object' || !authorIds.length) return [400, { message: 'no authors ids' }]

    const validAuthorIds = authorIds.map(authorId => {

        if (!authorId) return null

        const isValidID = mongoose.Types.ObjectId.isValid(authorId)
        if (!isValidID) return null

        const validAuthorId = mongoose.Types.ObjectId(authorId)
        if (!validAuthorId) return [500, { message: 'something happened when casting object id' }]
        return validAuthorId
    })

    const data = await authorModel
        .find({ _id: { $in: validAuthorIds } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (!data) return [500, { message: 'something wrong when calling author model' }]

    return [data.status || 200, data]
}

const GetOne = async (authorId) => { // OK

    if (!authorId || typeof authorId !== 'string') return [400, { message: 'no author id' }]

    const isValidID = mongoose.Types.ObjectId.isValid(authorId)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const validAuthorId = mongoose.Types.ObjectId(authorId)
    if (!validAuthorId) return [400, { message: 'something happened when casting object id' }]

    const data = await authorModel
        .findById(validAuthorId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    return [data.status || 200, data]
}

module.exports = {
    GetMany,
    GetManyByIds,
    GetOne
}