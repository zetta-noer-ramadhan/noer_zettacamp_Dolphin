const Song = function (title, artist, album, year, genre, duration) {
    this.title = title
    this.artist = artist
    this.album = album
    this.year = year
    this.genre = genre
    this.duration = duration
}

const list = []

const add = (title, artist, album, year, genre, duration) => {
    list.push(new Song(title, artist, album, year, genre, duration))
}

const seed = () => {
    add('Menyulam Azzam', 'Anonymous Alliance', 'Majmu Swara', 2019, 'Hip-Hop', 245)
    add('Semerkah Merah Rumah', 'Anonymous Alliance', 'Durma Kota: Musik Pendamping Zine Festival', 2017, 'Hip-Hop', 276)

    add('Re-Aksi', 'REKVMJEJVK', 'REKVMJEJVK: Unreleased', 2017, 'Hip-Hop', 192)
    add('Surfaith', 'REKVMJEJVK', 'REKVMJEJVK: Unreleased', 2017, 'Hip-Hop', 200)
    add('Menjelang Terang', 'REKVMJEJVK', 'REKVMJEJVK: Unreleased', 2017, 'Hip-Hop', 241)

    add('Devil in Disguise', 'Sigmun', 'Crimson Eyes', 2015, 'Rock', 326)
    add('Prayer of Tempest', 'Sigmun', 'Crimson Eyes', 2015, 'Rock', 445)
    add('Golden Tangerine', 'Sigmun', 'Crimson Eyes', 2015, 'Rock', 368)
    add('Aerial Chateau', 'Sigmun', 'Crimson Eyes', 2015, 'Rock', 414)

    add('Rémora', 'Klô Pelgag', 'Notre-Dame-des-Sept-Douleurs', 2020, 'Pop', 270)
    add('Umami', 'Klô Pelgag', 'Notre-Dame-des-Sept-Douleurs', 2020, 'Pop', 269)
    add("J'aurai les cheveux longs", 'Klô Pelgag', 'Notre-Dame-des-Sept-Douleurs', 2020, 'Pop', 236)
    add("À l'ombre des cyprès", 'Klô Pelgag', 'Notre-Dame-des-Sept-Douleurs', 2020, 'Pop', 340)
    add('Für Élise', 'Klô Pelgag', 'Notre-Dame-des-Sept-Douleurs', 2020, 'Pop', 175)

    add('君という花', 'Asian Kung-Fu Generation', '君繋ファイブエム', 2003, 'Rock', 370)
    add('ブルートレイン', 'Asian Kung-Fu Generation', 'ファンクラブ', 2006, 'Rock', 259)
    add('アフターダーク', 'Asian Kung-Fu Generation', 'ワールド ワールド ワールド', 2008, 'Rock', 252)
    add('転がる岩、君に朝が降る', 'Asian Kung-Fu Generation', 'ワールド ワールド ワールド', 2008, 'Rock', 278)
    add('ソラニン', 'Asian Kung-Fu Generation', 'マジックディスク', 2010, 'Rock', 273)
    add('それでは、また明日', 'Asian Kung-Fu Generation', 'Landmark', 0, 'Rock', 222)
}

const randomizeIndex = (maxIndex) => Math.floor(Math.random() * maxIndex)

module.exports = {
    seed,
    list,
    randomizeIndex
}