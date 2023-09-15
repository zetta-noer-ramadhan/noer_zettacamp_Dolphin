const { list, randomizeIndex } = require('../helper/util')

const groupByProperty = (data, property) => {
    const propertyList = data.map(item => item[property])
    const propertyDistinct = new Set(propertyList)
    const propertyDistinctArray = Array.from(propertyDistinct)

    return propertyDistinctArray.map(prop => {
        const propertySongs = data.filter(item => item[property] === prop)
        const propertyData = {
            [property + '_name']: prop,
            [property + '_songs']: propertySongs
        }
        return propertyData
    })
}

const groupByPropertyMap = (data, property) => {
    const propertyList = data.map(item => item[property])
    const propertyDistinct = new Set(propertyList)
    const propertyDistinctArray = Array.from(propertyDistinct)

    const groupMap = new Map()
    for (let prop of propertyDistinctArray) {
        const groupData = data.filter(item => item[property] === prop)
        groupMap.set(prop, groupData)
    }
    return groupMap
}

const groupByArtist = () => {
    const group = groupByProperty(list, 'artist')
    const groupMap = groupByPropertyMap(list, 'artist')
    const groupMapObject = Object.fromEntries(groupMap)

    return [200, group]
}

const groupByGenre = () => {
    const group = groupByProperty(list, 'genre')
    const groupMap = groupByPropertyMap(list, 'genre')
    const groupMapObject = Object.fromEntries(groupMap)

    return [200, group]
}

const groupByDuration = () => {

    const oneHourInSecond = 3600
    const group = new Set()

    let currentDuration = 0
    let nextDuration = 0

    while (nextDuration < oneHourInSecond) {

        const currentIndex = randomizeIndex(list.length)
        const currentSong = list[currentIndex]

        currentDuration = 0
        group.forEach(song => {
            currentDuration += song.duration
        })

        nextDuration = currentDuration + currentSong.duration

        if (nextDuration < oneHourInSecond) group.add(currentSong)

    }

    let totalDuration = 0
    group.forEach(song => {
        totalDuration += song.duration
    })

    const data = {
        duration: totalDuration,
        songs: Array.from(group)
    }

    return [200, data]
}


module.exports = {
    groupByArtist,
    groupByGenre,
    groupByDuration
}
