const { ApolloError } = require('apollo-server-express')
const DataLoader = require('dataloader')
const bookService = require('../../service/book.service')

const loader = new DataLoader(async (keys) => {

    const [status, data] = await bookService.GetManyByIds(keys)
    if (status !== 200) throw new ApolloError('something happened when trying to get book from loader')

    const dataMap = new Map()

    data.forEach(item => dataMap.set(String(item._id), item))

    return keys.map(key => dataMap.get(String(key)) || null)
})

module.exports = loader