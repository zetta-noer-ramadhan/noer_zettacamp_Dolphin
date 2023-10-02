const DataLoader = require('dataloader')
const bookService = require('../../service/book.service')

const loader = new DataLoader(async (keys) => {

    const [_, data] = await bookService.readAll()
    const dataMap = new Map()

    data.forEach(item => dataMap.set(String(item._id), item))

    return keys.map(key => dataMap.get(String(key)))
})

module.exports = loader