const mongoose = require('mongoose')
const playlistModel = require('../model/playlist.model')
const songModel = require('../model/song.model')

const songs = {}



// Functional: OK
// TODO: mongo response handling
// TODO: aggregation exploration (better $match, better $group, implement $lookup)
// TODO: query parameter
// FIXME: important
songs.getSongsQuery = async (size, page) => {
    const pageLimit = +size
    const pageSkip = +(page) - 1

    if (page < 1) return [400, {
        message: 'page query must be greater than or equal to one'
    }]

    const data = await songModel
        .aggregate([
            {
                $match: {
                    year: {
                        $lt: 2020,
                        $gt: 1990
                    }
                }
            },
            {
                $lookup: {
                    from: 'playlists',
                    localField: 'playlist',
                    foreignField: '_id',
                    as: 'playlist'
                }
            },
            {
                $project: { _id: 0, __v: 0, playlist: { songs: 0 } }
            },
            {
                $sort: {
                    artist: 1,
                    _id: 1
                }
            },
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
                            }
                        },
                        { $addFields: { page: pageSkip + 1 } },
                        {
                            $project: {
                                _id: 0,
                                page: 1,
                                totalSongsPerPage: 1,
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
                        { $unwind: { path: '$genre' } },
                        {
                            $group: {
                                _id: '$genre',
                                total: { $sum: 1 },
                                songs: { $addToSet: '$$ROOT' }
                            }
                        }
                    ],


                    groupByArtist: [
                        {
                            $group: {
                                _id: '$artist',
                                total: { $sum: 1 },
                                songs: { $addToSet: '$$ROOT' }
                            }
                        }
                    ],


                    groupByYear: [
                        {
                            $group: {
                                _id: '$year',
                                total: { $sum: 1 },
                                songs: { $addToSet: '$$ROOT' }
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



// Functional: OK
songs.getSongs = async () => {

    const data = await songModel
        .find({})
        .populate('playlists')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (data.length === 0) return [200, { message: 'no songs exist' }]

    return [200, data]
}



// Functional: OK
songs.getSongById = async (songId) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(songId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validSongId = mongoose.Types.ObjectId(songId)

    const data = await songModel
        .findById(validSongId)
        .populate('playlists')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (!data) return [200, { message: 'song not found' }]

    return [200, data]
}



// Functional: OK
songs.createSong = async (songData) => {

    const data = await songModel
        .create(songData)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    return [200, { message: 'song created', data }]
}



// Functional: OK
// TODO: mongo response handling
// TODO: test cardinality
// FIXME: important, cardinality
songs.updateSongById = async (songId, songData) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(songId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validSongId = mongoose.Types.ObjectId(songId)

    if (songData?.playlist) {
        const isUpdatePlaylistIdValid = mongoose.Types.ObjectId.isValid(songData.playlist)
        if (!isUpdatePlaylistIdValid) return [400, { message: 'Invalid ID' }]

        const validUpdatePlaylistId = mongoose.Types.ObjectId(songData.playlist)

        const removedPlaylists = await playlistModel
            .updateOne(
                { songs: { $in: [validUpdatePlaylistId] } },
                { $pull: { songs: { $in: [validUpdatePlaylistId] } } }
            )
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (removedPlaylists?.err) return [removedPlaylists.status, removedPlaylists.err]

        const addedPlaylist = await playlistModel
            .findByIdAndUpdate(validUpdatePlaylistId, { $push: { songs: [validSongId] } })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (addedPlaylist?.err) return [addedPlaylist.status, addedPlaylist.err]
    }

    const data = await songModel
        .findByIdAndUpdate(validSongId, { ...songData }, { new: true })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (!data) return [200, { message: 'no song updated' }]

    return [200, data]
}



// Functional: OK
songs.deleteSongs = async () => {

    const updatedPlaylists = await playlistModel
        .updateMany(
            {},
            { $set: { songs: [] } }
        )
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (updatedPlaylists?.err) return [updatedPlaylists.status, updatedPlaylists.err]

    const data = await songModel
        .deleteMany()
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (data.ok && data.deletedCount === 0) return [200, { message: 'no song deleted' }]

    return [200, { message: 'songs deleted' }]
}



// Functional: OK
songs.deleteSongById = async (songId) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(songId)
    if (!isIdValid) return [400, { message: 'Invalid ID' }]

    const validSongId = mongoose.Types.ObjectId(songId)

    const updatedPlaylists = await playlistModel
        .updateOne(
            { songs: { $in: [validSongId] } },
            { $pull: { songs: { $in: [validSongId] } } }
        )
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (updatedPlaylists?.err) return [updatedPlaylists.status, updatedPlaylists.err]

    const data = await songModel
        .findByIdAndDelete(validSongId)
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (data?.err) return [data.status, data.err]

    if (data.ok && data.deletedCount === 0) return [200, { message: 'no song deleted' }]

    return [200, { message: 'song deleted' }]
}

module.exports = songs