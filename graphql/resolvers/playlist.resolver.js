const { ApolloError } = require('apollo-server-express')
const service = require('../../service/playlist.service')

// OK
const getAllPlaylists = async () => {
    const data = await service.getAll()
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const getPlaylistById = async (_, { playlistId }, context) => {
    try {
        const data = await context.playlistLoader.load(playlistId)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
    // const data = await service.getById(playlistId)
    // if(data?.err) throw new ApolloError(data.err)
    // return data
}

// OK
const createPlaylists = async (_, { playlistsData }) => {
    const data = await service.createMany(playlistsData)
    if(data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const updatePlaylistById = async (_, { playlistId, playlistData }) => {
    const data = await service.updateById(playlistId, playlistData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const deletePlaylistById = async (_, { playlistId }) => {
    const data = await service.deleteById(playlistId)
    console.log(data)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const addSongsToPlaylist = async (_, { playlistId, songsData }) => {
    const data = await service.addSongs(playlistId, songsData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const removeSongsFromPlaylist = async (_, { playlistId, songsData }) => {
    const data = await service.removeSongs(playlistId, songsData)
    if (data?.err) throw new ApolloError(data.err)
    return data
}

// OK
const songs = async (parent, _, context) => {
    if (!parent.songs) return null
    try {
        const data = await context.songLoader.loadMany(parent.songs)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

module.exports = {
    query: {
        getAllPlaylists,
        getPlaylistById
    },
    mutation: {
        createPlaylists,
        updatePlaylistById,
        deletePlaylistById,
        addSongsToPlaylist,
        removeSongsFromPlaylist
    },
    main: {
        Playlist: {
            songs
        }
    }
}