const DataLoader = require('dataloader')
const authorService = require('../../service/author.service')

const loader = new DataLoader(async (keys) => {

    const [_, data] = await authorService.getMany()

    const dataMap = data.reduce((array, current) => {
        array[current._id] = current
        return array
    }, [])

    return keys.map(key => dataMap[key])
})

module.exports = loader