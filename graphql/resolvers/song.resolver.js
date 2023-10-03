const { ApolloError } = require('apollo-server-express')
const service = require('../../service/song.service')

// OK
const getAllSongs = async () => {
    const data = await service.getAll()
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const getSongById = async (_, { songId }, context) => {
    try {
        const data = await context.songLoader.load(songId)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

// OK
const createSongs = async (_, { songsData }) => {
    const data = await service.createMany(songsData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const updateSongById = async (_, { songId, songData }) => {
    const data = await service.updateById(songId, songData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const deleteSongById = async (_, { songId }) => {
    const data = await service.deleteById(songId)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const playlist = async (parent, _, context) => {
    if (!parent.playlist) return null
    try {
        const data = await context.playlistLoader.load(parent.playlist)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

module.exports = {
    query: {
        getAllSongs,
        getSongById
    },
    mutation: {
        createSongs,
        updateSongById,
        deleteSongById
    },
    main: {
        Song: {
            playlist
        }
    }
}