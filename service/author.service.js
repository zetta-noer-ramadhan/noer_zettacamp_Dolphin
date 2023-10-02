const authorModel = require('../model/author.model')

const getMany = async () => {

    const data = await authorModel
        .find({})
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    return [200, data]
}

const getOne = async (authorId) => {

    const isValidID = mongoose.Types.ObjectId.isValid(authorId)
    if (!isValidID) return [400, { message: 'invalid ID' }]

    const validAuthorId = mongoose.Types.ObjectId(authorId)

    const data = await authorModel
        .findById(validAuthorId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    return [200, data]
}

module.exports = {
    getMany,
    getOne
}