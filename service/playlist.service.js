const mongoose = require('mongoose')
const playlistModel = require('../model/playlist.model')
const songModel = require('../model/song.model')

const playlists = {}




// Functionial: OK
// TODO: mongo response handling
// TODO: aggregation exploration (better $match, better $group)
// TODO: query parameter
// FIXME: important
playlists.getPlaylistsQuery = async (playlistId, size, page) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    const pageLimit = +size
    const pageSkip = +(page) - 1

    if (page < 1) return [400, {
        message: 'page query must be greater than or equal to one'
    }]

    const data = await playlistModel
        .aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ['$_id', validPlaylistId]
                    }
                }
            },
            {
                $lookup: {
                    from: 'songs',
                    as: 'songs',
                    let: {
                        currentSongId: '$songs'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$currentSongId']
                                }
                            }
                        },
                        {
                            $sort: {
                                title: 1,
                                _id: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: '$songs' } },
            {
                $facet: {

                    totalSongsAllPages: [
                        {
                            $group: {
                                _id: null,
                                songs: { $sum: 1 }
                            }
                        },
                        { $project: { _id: 0, songs: 1 } }
                    ],

                    currentPage: [
                        { $skip: pageLimit * pageSkip },
                        { $limit: pageLimit },
                        {
                            $group: {
                                _id: null,
                                totalSongsPerPage: { $sum: 1 },
                                totalDuration: { $sum: "$songs.duration" }
                            }
                        },
                        { $addFields: { page: pageSkip + 1 } },
                        {
                            $project: {
                                _id: 0,
                                page: 1,
                                totalSongsPerPage: 1,
                                totalDuration: 1
                            }
                        }
                    ],

                    paginate: [
                        { $skip: pageLimit * pageSkip },
                        { $limit: pageLimit },
                        {
                            $project: {
                                __v: 0,
                                _id: 0
                            }
                        }
                    ],

                    groupByGenre: [
                        {
                            $group: {
                                _id: '$songs.genre',
                                total: { $sum: 1 },
                                data: { $push: '$$ROOT' }
                            }
                        },
                        {
                            $sort: {
                                _id: -1
                            }
                        },
                        {
                            $project: {
                                data: {
                                    name: 0,
                                    __v: 0
                                }
                            }
                        }
                    ],


                    groupByArtist: [
                        {
                            $group: {
                                _id: '$songs.artist',
                                total: { $sum: 1 },
                                data: { $push: '$$ROOT' }
                            }
                        },
                        {
                            $project: {
                                data: {
                                    name: 0,
                                    __v: 0
                                }
                            }
                        }
                    ],


                    groupByYear: [
                        {
                            $group: {
                                _id: '$songs.year',
                                total: { $sum: 1 },
                                data: { $push: '$$ROOT' }
                            }
                        },
                        {
                            $project: {
                                data: {
                                    name: 0,
                                    __v: 0
                                }
                            }
                        }
                    ]
                }
            }
        ])
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}



// Functionial: OK
playlists.getPlaylists = async () => {

    const data = await playlistModel
        .find({})
        .populate('songs')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (data.length === 0) return [200, { message: 'no playlists exist' }]

    return [200, data]
}



// Functionial: OK
playlists.getPlaylistById = async (playlistId) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    const data = await playlistModel
        .findById(validPlaylistId)
        .populate('songs')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (!data) return [200, { message: 'playlist not found' }]

    return [200, data]
}



// Functionial: OK
playlists.createPlaylist = async (playlistData) => {

    const data = await playlistModel
        .create({ ...playlistData, songs: [] })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, { message: 'playlist created', data }]
}



// Functionial: OK
// TODO: mongo response handling
playlists.addPlaylistSongs = async (playlistId, songData) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    if (!songData || songData?.length === 0) return [400, { message: 'Bad Parameter Format' }]

    const validSongIds = new Set()

    for (let songId of songData) {

        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)
        if (!isSongIdValid) return [400, { message: 'Invalid ID' }]

        const validSongId = mongoose.Types.ObjectId(songId)

        const validSong = await songModel
            .findByIdAndUpdate(validSongId, { $set: { playlist: validPlaylistId } })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (validSong?.err) return [validSong.status, validSong.err]

        if (!validSong) return [200, { message: 'song not found' }]

        validSongIds.add(validSongId)
    }

    const validSongIdArray = Array.from(validSongIds)

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $addToSet: { songs: validSongIdArray } }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}



// Functionial: OK
// TODO: test
// TODO: test cardinality
// FIXME: important, cardinality
playlists.updatePlaylistById = async (playlistId, playlistData) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    if (playlistData?.songs) {

        const removedSong = await songModel
            .updateMany(
                { playlist: validPlaylistId },
                { $unset: { playlist: "" } }
            )
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (removedSong?.err) return [removedSong.status, removedSong.err]

        for (let songId of playlistData.songs) {
            const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)
            if (!isSongIdValid) return [400, { message: 'Invalid ID' }]

            const validSongId = mongoose.Types.ObjectId(songId)

            const validSong = await songModel
                .findByIdAndUpdate(validSongId, { $set: { playlist: validPlaylistId } })
                .catch(err => ({ status: 500, err }))
                .then(data => data)

            if (validSong?.err) return [validSong.status, validSong.err]

            if (!validSong) return [200, { message: 'song not found' }]
        }
    }

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, playlistData)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}



// Functionial: OK
playlists.deletePlaylists = async () => {

    const removedSong = await songModel
        .updateMany(
            {},
            { $unset: { playlist: "" } }
        )
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removedSong?.err) return [removedSong.status, removedSong.err]

    const data = await playlistModel
        .deleteMany()
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (data.ok && data.deletedCount === 0) return [200, { message: 'no playlist deleted' }]

    return [200, { message: 'playlists deleted' }]
}



// Functionial: OK
playlists.deletePlaylistById = async (playlistId) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    const removedSong = await songModel
        .updateMany(
            { playlist: validPlaylistId },
            { $unset: { playlist: "" } }
        )
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removedSong?.err) return [removedSong.status, removedSong.err]

    const data = await playlistModel
        .findByIdAndDelete(validPlaylistId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (data.ok && data.deletedCount === 0) return [200, { message: 'no playlist deleted' }]

    return [200, { message: 'playlist deleted' }]
}



// Functionial: OK
// TODO: mongo response handling
playlists.removePlaylistSongs = async (playlistId) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    const removedSong = await songModel
        .updateMany(
            { playlist: validPlaylistId },
            { $unset: { playlist: "" } }
        )
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removedSong?.err) return [removedSong.status, removedSong.err]

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $set: { songs: [] } }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}



// Functionial: OK
// TODO: mongo response handling
playlists.removePlaylistSongById = async (playlistId, songId) => {

    const isPlaylistIdValid = mongoose.Types.ObjectId.isValid(playlistId)
    if (!isPlaylistIdValid) return [400, { message: 'Invalid ID' }]

    const validPlaylistId = mongoose.Types.ObjectId(playlistId)

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId)
    if (!isSongIdValid) return [400, { message: 'Invalid ID' }]

    const validSongId = mongoose.Types.ObjectId(songId)

    const removedSong = await songModel
        .findByIdAndUpdate(validSongId, { $unset: { playlist: "" } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removedSong?.err) return [removedSong.status, removedSong.err]

    const data = await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $pull: { songs: { $in: [validSongId] } } }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, data]
}



module.exports = playlists