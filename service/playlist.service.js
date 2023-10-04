const mongoose = require('mongoose')
const songModel = require('../model/song.model')
const playlistModel = require('../model/playlist.model')

// OK
const getAll = async () => {
    const data = await playlistModel
        .find({})
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const getAllByIds = async (playlistIds) => {

    const validIds = playlistIds.map(playlistId => {
        const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)

        if (!isIdValid) return null

        const validId = mongoose.Types.ObjectId(playlistId)

        return validId
    })

    const data = await playlistModel
        .find({ _id: { $in: validIds } })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const getById = async (playlistId) => {

    const data = await playlistModel
        .findById(playlistId)
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const createMany = async (playlistsData) => {

    const result = []

    for (let playlistData of playlistsData) {

        const data = await playlistModel
            .create({ ...playlistData, songs: [] })
            .catch(err => ({ status: 500, err }))

        result.push(data)
    }
    return result
}

// OK
const updateById = async (playlistId, playlistData) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)

    if (!isIdValid) ({
        status: 400,
        message: 'Invalid ID'
    })

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    if (playlistData?.songs) {

        const removedSong = await songModel
            .updateMany(
                { playlist: validPlaylistId },
                { $unset: { playlist: "" } }
            )
            .catch(err => ({ status: 500, err }))

        if (removedSong?.err) return [removedSong.status, removedSong.err]

        for (let songId of playlistData.songs) {
            const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

            if (!isSongIdValid) ({
                status: 400,
                message: 'Invalid ID'
            })

            const validSongId = mongoose.Types.ObjectId(songId)

            const validSong = await songModel
                .findByIdAndUpdate(validSongId, { $set: { playlist: validPlaylistId } })
                .catch(err => ({ status: 500, err }))
        }
    }

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, { ...playlistData }, { new: true })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const deleteById = async (playlistId) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    const removedSong = await songModel
        .updateMany(
            { playlist: validPlaylistId },
            { $unset: { playlist: "" } }
        )
        .catch(err => ({ status: 500, err }))

    const data = await playlistModel
        .findByIdAndDelete(validPlaylistId)
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const addSongs = async (playlistId, songsData) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)

    if (!isIdValid) return ({
        status: 400,
        message: 'Invalid ID'
    })

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    if (!songsData || songsData?.length === 0) return ({
        status: 400,
        message: 'Bad Parameter'
    })

    const validSongIds = new Set()

    for (let songId of songsData) {

        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

        if (!isSongIdValid) return ({
            status: 400,
            message: 'Invalid ID'
        })

        const validSongId = mongoose.Types.ObjectId(songId)

        const validSong = await songModel
            .findByIdAndUpdate(validSongId, { $set: { playlist: validPlaylistId } })
            .catch(err => ({ status: 500, err }))

        validSongIds.add(validSongId)
    }

    const validSongIdArray = Array.from(validSongIds)

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $addToSet: { songs: validSongIdArray } }, { new: true })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const removeSongs = async (playlistId, songsData) => {

    const isPlaylistIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isPlaylistIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    if (!songsData || songsData?.length === 0) return ({
        status: 400,
        message: 'Bad Parameter'
    })

    for(let songId of songsData){
        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)

        if (!isSongIdValid) return ({
            status: 400,
            message: 'Invalid ID'
        })

        const validSongId = mongoose.Types.ObjectId(songId)

        const removedSong = await songModel
            .findByIdAndUpdate(validSongId, { $unset: { playlist: "" } })
            .catch(err => ({ status: 500, err }))
    }

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $pull: { songs: { $in: songsData } } }, { new: true })
        .catch(err => ({ status: 500, err }))

    return data
}

module.exports = {
    getAll,
    getAllByIds,
    getById,
    createMany,
    updateById,
    deleteById,
    addSongs,
    removeSongs
}