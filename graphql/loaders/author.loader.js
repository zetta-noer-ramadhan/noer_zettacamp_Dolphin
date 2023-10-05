const { ApolloError } = require('apollo-server-express')
const DataLoader = require('dataloader')
const authorService = require('../../service/author.service')

const loader = new DataLoader(async (keys) => {

    const [status, data] = await authorService.GetManyByIds(keys)
    if(status !== 200) throw new ApolloError('something happened when trying to get author from loader')

    const dataMap = new Map()

    data.forEach(item => dataMap.set(String(item._id), item))

    return keys.map(key => dataMap.get(String(key)) || null)
})

module.exports = loader