const { ApolloError } = require('apollo-server-express')
const DataLoader = require('dataloader')
const service = require('../../service/song.service')

// OK
const loader = new DataLoader(async (keys) => {

    const data = await service.getAllByIds(keys)
    if (data?.err) throw new ApolloError('db error')
    const dataMap = new Map()

    data.forEach(item => dataMap.set(String(item._id), item))

    return keys.map(key => dataMap.get(String(key)))
})

module.exports = loader