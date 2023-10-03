const DataLoader = require('dataloader')
const service = require('../../service/song.service')

// OK
const loader = new DataLoader(async (keys) => {

    const data = await service.getAllByIds(keys)
    const dataMap = new Map()

    data.forEach(item => dataMap.set(String(item._id), item))

    return keys.map(key => dataMap.get(String(key)))
})

module.exports = loader