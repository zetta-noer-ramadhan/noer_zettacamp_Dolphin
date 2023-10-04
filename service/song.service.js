const mongoose = require('mongoose')
const songModel = require('../model/song.model')
const playlistModel = require('../model/playlist.model')

// OK
const getAll = async () => {

    const data = await songModel
        .find({})
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const getAllByIds = async (songIds) => {

    const validIds = songIds.map(songId => {
        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

        if (!isSongIdValid) return null

        const validSongId = mongoose.Types.ObjectId(songId)

        return validSongId
    })

    const data = await songModel
        .find({ _id: { $in: validIds } })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const getById = async (songId) => {

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

    if (!isSongIdValid) return ({
        status: 400,
        message: 'Invalid ID'
    })

    const validSongId = mongoose.Types.ObjectId(songId)

    const data = await songModel
        .findById(validSongId)
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const createMany = async (songsData) => {

    const result = []

    for (let songData of songsData) {

        const data = await songModel
            .create(songData)
            .catch(err => ({ status: 500, err }))

        result.push(data)
    }
    return result
}

// OK
const updateById = async (songId, songData) => {

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

    if (!isSongIdValid) return ({
        status: 400,
        message: 'Invalid ID'
    })

    const validSongId = mongoose.Types.ObjectId(songId)

    if(songData?.playlist){

        const isUpdatePlaylistIdValid = mongoose.Types.ObjectId.isValid(songData.playlist)

        if (!isUpdatePlaylistIdValid) return ({
            status: 400,
            message: 'Invalid ID'
        })

        const validUpdatePlaylistId = mongoose.Types.ObjectId(songData.playlist)

        const removedPlaylists = await playlistModel
            .updateOne(
                { songs: { $in: [validUpdatePlaylistId] } },
                { $pull: { songs: { $in: [validUpdatePlaylistId] } } }
            )
            .catch(err => ({ status: 500, err }))

        const addedPlaylist = await playlistModel
            .findByIdAndUpdate(validUpdatePlaylistId, { $push: { songs: [validSongId] } })
            .catch(err => ({ status: 500, err }))
    }

    const data = await songModel
        .findByIdAndUpdate(validSongId, { ...songData }, { new: true })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const deleteById = async (songId) => {

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

    if (!isSongIdValid) return ({
        status: 400,
        message: 'Invalid ID'
    })

    const validSongId = mongoose.Types.ObjectId(songId)

    const updatedPlaylist = await playlistModel
        .updateOne(
            { songs: { $in: [validSongId] } },
            { $pull: { songs: { $in: [validSongId] } } }
        )
        .catch(err => ({ status: 500, err }))

    const data = await songModel
        .findByIdAndDelete(validSongId)
        .catch(err => ({ status: 500, err }))

    return data
}

module.exports = {
    getAll,
    getAllByIds,
    getById,
    createMany,
    updateById,
    deleteById
}