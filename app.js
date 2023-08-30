const FindGroupByProperty = (data, property, param) => data.filter(item => item[property] === param)
const FindGroupByGenre = (data, param) => FindGroupByProperty(data, 'genre', param)
const FindGroupByArtist = (data, param) => FindGroupByProperty(data, 'artist', param)

const GroupByProperty = (data, property) => {
    const propertyList = new Set(data.map(item => item[property]))
    return Array.from(propertyList).map(prop => ({
        group_name: prop,
        group_data: data.filter(item => item[property] == prop)
    }))
}
const GroupByGenre = (data) => GroupByProperty(data, 'genre')
const GroupByArtist = (data) => GroupByProperty(data, 'artist')

const GetRandom = (lower, upper) => Math.floor(Math.random() * (upper - lower + 1) + lower)

const oneHourInSecond = 60 * 60 // 3600

const GroupWithDuration = (data) => {
    const group = []
    while (true) {
        const currIndex = GetRandom(0, data.length - 1)
        const currDuration = group.reduce((total, current) => total + current.duration, 0)
        const nextDuration = currDuration + data[currIndex].duration
        if (nextDuration <= oneHourInSecond) group.push(data[currIndex])
        else break
    }
    return {
        duration: group.reduce((t, c) => t + c.duration, 0),
        data: group
    }
}


const Song = function (title, artist, album, year, genre, duration) {
    this.title = title
    this.artist = artist
    this.album = album
    this.year = year
    this.genre = genre
    this.duration = duration
}

const list = []

const AddToList = (list, title, artist, album, year, genre, duration) => {
    list.push(new Song(title, artist, album, year, genre, duration))
}

AddToList(list, "Sample Title", "Sample Artist", "Sample Album", 2023, "Genre1", 1140)
AddToList(list, "Sample Title 1", "Sample", "Sample Album 1", 2024, "Genre1", 600)
AddToList(list, "Sample Title 2", "Sample Artist 2", "Sample Album 2", 2023, "Genre2", 1200)
AddToList(list, "Sample Title 3", "Sample Artist", "Sample Album", 2023, "Genre3", 900)
AddToList(list, "Sample Title 4", "Sample", "Sample Album 1", 2024, "Genre4", 1500)
AddToList(list, "Sample Title 5", "Sample Artist 2", "Sample Album 2", 2023, "Genre2", 700)
AddToList(list, "Sample Title 6", "Sample Artist", "Sample Album", 2023, "Genre1", 400)
AddToList(list, "Sample Title 7", "Sample", "Sample Album 1", 2024, "Genre1", 237)
AddToList(list, "Sample Title 8", "Sample Artist 3", "Sample Album 2", 2023, "Genre2", 830)
AddToList(list, "Sample Title 9", "Sample Artist", "Sample Album", 2023, "Genre3", 300)
AddToList(list, "Sample Title 10", "Sample", "Sample Album 1", 2024, "Genre4", 500)
AddToList(list, "Sample Title 11", "Sample Artist 4", "Sample Album 2", 2023, "Genre2", 700)

// console.log(list)
console.log('GBA', GroupByArtist(list), '\n')
console.log('GBG', GroupByGenre(list), '\n')
console.log('GWD', GroupWithDuration(list), '\n')

console.log('FGA', FindGroupByArtist(list, 'Sample'), '\n')
console.log('FGG', FindGroupByGenre(list, 'Genre1'))


// const objectLog = (args) => console.log(JSON.stringify(args, null, 2))

// objectLog(GroupByGenre(list))
// objectLog(GroupByArtist(list))