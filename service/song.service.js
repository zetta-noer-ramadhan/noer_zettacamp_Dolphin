const mongoose = require('mongoose');
const songModel = require('../model/song.model');
const playlistModel = require('../model/playlist.model');
const { RandomizeIndex } = require('../helper/util');

const GetAll = async (filter) => {
    filter = filter && Object.keys(filter).length > 0 ? filter : {};
    return await songModel.find(filter).catch((err) => ({ status: 500, err }));
};

const GetAllByIds = async (songIds) => {
    const validIds = songIds.map((songId) => {
        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
        if (!isSongIdValid) {
            return null;
        }
        return mongoose.Types.ObjectId(songId);
    });

    return await songModel.find({ _id: { $in: validIds } }).catch((err) => ({ status: 500, err }));
};

// TODO: OK
const GetAllGroupByField = async (field) => {
    if (!field || typeof field !== 'string') {
        return { status: 500, message: 'bad parameter' };
    }

    const pipeline = [];

    pipeline.push({ $sort: { _id: 1, title: 1 } });

    if (field === 'genre') pipeline.push({ $unwind: { path: '$' + field } });

    pipeline.push({ $group: { _id: '$' + field, song_ids: { $addToSet: '$_id' }, duration: { $sum: '$duration' } } });
    pipeline.push({ $addFields: { name: { $concat: ['$_id', '\'s Playlist'] } } });

    return await songModel.aggregate(pipeline);
};

// TODO: OK
const GetRandomGroupOneHour = async () => {
    const list = await songModel.aggregate([{ $project: { _id: 1, duration: 1 } }]).catch((err) => ({ status: 500, err }));

    if (!list) {
        return { status: 500, message: 'something is not right' };
    }

    const oneHourInSecond = 3600;
    const group = new Set();

    let currentDuration = 0;
    let nextDuration = 0;

    while (nextDuration < oneHourInSecond) {
        const currentIndex = RandomizeIndex(list.length);
        const currentSong = list[currentIndex];

        currentDuration = Array.from(group).reduce((total, current) => total + current.duration, 0);
        nextDuration = currentDuration + currentSong.duration;

        if (nextDuration < oneHourInSecond) group.add(currentSong);
    }

    return [
        {
            name: 'Random Playlist',
            song_ids: Array.from(group).map((item) => item._id),
            duration: Array.from(group).reduce((total, current) => total + current.duration, 0),
        },
    ];
};

const GetById = async (songId) => {
    if (!songId) {
        return { status: 400, message: 'bad params' };
    }

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
    if (!isSongIdValid) {
        return { status: 400, message: 'Invalid ID' };
    }
    const validSongId = mongoose.Types.ObjectId(songId);

    return await songModel.findById(validSongId).catch((err) => ({ status: 500, err }));
};

const CreateMany = async (songsData) => {
    if (!songsData || typeof songsData !== 'object' || !songsData.length) {
        return { status: 400, message: 'bad params' };
    }

    const result = [];

    for (let songData of songsData) {
        const { title, artist_name, album_name, genre, year, duration } = songData;
        if (!title || !artist_name || !album_name || !year || !duration || !genre || typeof genre !== 'object' || !genre.length) {
            return { status: 400, message: 'bad params' };
        }
        const data = await songModel.create(songData).catch((err) => ({ status: 500, err }));

        result.push(data);
    }
    return result;
};

const UpdateById = async (songId, songData) => {
    if (!songId || !songData || typeof songData !== 'object' || !Object.keys(songData).length) {
        return { status: 400, message: 'bad params' };
    }

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
    if (!isSongIdValid) {
        return { status: 400, message: 'Invalid ID' };
    }
    const validSongId = mongoose.Types.ObjectId(songId);

    if (songData.playlist) {
        const isUpdatePlaylistIdValid = mongoose.Types.ObjectId.isValid(songData.playlist);
        if (!isUpdatePlaylistIdValid) {
            return { status: 400, message: 'Invalid ID' };
        }
        const validUpdatePlaylistId = mongoose.Types.ObjectId(songData.playlist);

        await playlistModel
            .updateOne({ songs: { $in: [validUpdatePlaylistId] } }, { $pull: { songs: { $in: [validUpdatePlaylistId] } } })
            .catch((err) => ({ status: 500, err }));

        await playlistModel
            .findByIdAndUpdate(validUpdatePlaylistId, { $push: { songs: [validSongId] } })
            .catch((err) => ({ status: 500, err }));
    }

    return await songModel.findByIdAndUpdate(validSongId, { ...songData }, { new: true }).catch((err) => ({ status: 500, err }));
};

const DeleteById = async (songId) => {
    if (!songId) {
        return { status: 400, message: 'bad params' };
    }

    const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
    if (!isSongIdValid) {
        return { status: 400, message: 'Invalid ID' };
    }
    const validSongId = mongoose.Types.ObjectId(songId);

    await playlistModel
        .updateOne({ songs: { $in: [validSongId] } }, { $pull: { songs: { $in: [validSongId] } } })
        .catch((err) => ({ status: 500, err }));

    return await songModel.findByIdAndDelete(validSongId).catch((err) => ({ status: 500, err }));
};

module.exports = {
    GetAll,
    GetAllByIds,
    GetAllGroupByField,
    GetRandomGroupOneHour,
    GetById,
    CreateMany,
    UpdateById,
    DeleteById,
};
