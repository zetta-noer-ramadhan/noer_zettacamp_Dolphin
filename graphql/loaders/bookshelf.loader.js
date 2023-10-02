const DataLoader = require('dataloader')
const bookshelfService = require('../../service/bookshelf.service')

const loader = new DataLoader(async (keys) => {

    const [_, data] = await bookshelfService.getMany()

    const dataMap = data.reduce((array, current) => {
        array[current._id] = current
        return array
    }, [])

    return keys.map(key => dataMap[key])
})

module.exports = loader