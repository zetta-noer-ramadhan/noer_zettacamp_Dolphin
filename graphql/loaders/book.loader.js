const DataLoader = require('dataloader')
const bookService = require('../../service/book.service')

const loader = new DataLoader(async (keys) => {

    const [_, data] = await bookService.readAll()

    const dataMap = data.reduce((array, current) => {
        array[current._id] = current
        return array
    }, [])

    return keys.map(key => dataMap[key])
})

module.exports = loader