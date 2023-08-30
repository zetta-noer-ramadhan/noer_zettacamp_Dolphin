// const FindGroupByProperty = (data, property, param) => data.filter(item => item[property] === param)
// const FindGroupByGenre = (data, param) => FindGroupByProperty(data, 'genre', param)
// const FindGroupByArtist = (data, param) => FindGroupByProperty(data, 'artist', param)


const GroupByProperty = (data, property) => {
    const propertyList = new Set(data.map(item => item[property]))
    return Array.from(propertyList).map(prop => ({
        group_name: prop,
        group_data: data.filter(item => item[property] == prop)
    }))
}

const GroupByGenre = (data) => GroupByProperty(data, 'genre')
const GroupByArtist = (data) => GroupByProperty(data, 'artist')


const oneHourInSecond = 60 * 60 // 3600
const GetRandom = (lower, upper) => Math.floor(Math.random() * (upper - lower + 1) + lower)

const GroupWithDuration = (data) => {
    const group = []

    while (true) {
        const currentIndex = GetRandom(0, data.length - 1)
        const currentDuration = group.reduce((total, current) => total + current.duration, 0)
        const nextDuration = currentDuration + data[currentIndex].duration

        if (nextDuration <= oneHourInSecond) group.push(data[currentIndex])
        else break
    }

    return {
        duration: group.reduce((total, current) => total + current.duration, 0),
        data: group
    }
    // return group
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

AddToList(list, "Title 0", "Artist", "Album", 2023, "Genre1", 1140)
AddToList(list, "Title 1", "Sample", "Album 1", 2024, "Genre1", 600)
AddToList(list, "Title 2", "Artist 2", "Album 2", 2023, "Genre2", 1200)
AddToList(list, "Title 3", "Artist", "Album", 2023, "Genre3", 900)
AddToList(list, "Title 4", "Sample", "Album 1", 2024, "Genre4", 1500)
AddToList(list, "Title 5", "Artist 2", "Album 2", 2023, "Genre2", 700)
AddToList(list, "Title 6", "Artist", "Album", 2023, "Genre1", 400)
AddToList(list, "Title 7", "Sample", "Album 1", 2024, "Genre1", 237)
AddToList(list, "Title 8", "Artist 3", "Album 2", 2023, "Genre2", 830)
AddToList(list, "Title 9", "Artist", "Album", 2023, "Genre3", 300)
AddToList(list, "Title 10", "Sample", "Album 1", 2024, "Genre4", 500)
AddToList(list, "Title 11", "Artist 4", "Album 2", 2023, "Genre2", 700)




// console.log(list)

// console.log('GBA', GroupByArtist(list), '\n')
// console.log('GBG', GroupByGenre(list), '\n')
// console.log('GWD', GroupWithDuration(list), '\n')

// console.log('FGA', FindGroupByArtist(list, 'Sample'), '\n')
// console.log('FGG', FindGroupByGenre(list, 'Genre1'), '\n')
// console.log('GWD', GroupWithDuration(list), '\n')


const objectLog = (name, args) => console.log(name, JSON.stringify(args, null, 2))

// objectLog('\nArtist', GroupByArtist(list))
// objectLog('\nGenre', GroupByGenre(list))
// objectLog('\nDuration', GroupWithDuration(list))