const mongoose = require('mongoose');
const songModel = require('../model/song.model');
const playlistModel = require('../model/playlist.model');

const GetAll = async (filter) => {
    filter = filter && Object.keys(filter).length > 0 ? filter : {};
    return await playlistModel.find(filter).catch((err) => ({ status: 500, err }));
};

const GetAllByIds = async (playlistIds) => {
    const validIds = playlistIds.map((playlistId) => {
        const isIdValid = mongoose.Types.ObjectId.isValid(playlistId);
        if (!isIdValid) {
            return null;
        }

        return mongoose.Types.ObjectId(playlistId);
    });

    return await playlistModel.find({ _id: { $in: validIds } }).catch((err) => ({ status: 500, err }));
};

const GetById = async (playlistId) => {
    if (!playlistId) {
        return { status: 400, message: 'bad params' };
    }

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId);
    if (!isIdValid) {
        return { status: 400, message: 'invalid ID' };
    }
    const validPlaylistId = mongoose.Types.ObjectId(playlistId);

    return await playlistModel.findById(validPlaylistId).catch((err) => ({ status: 500, err }));
};

// TODO: OK
const GetAllWithDuration = async () => {
    const pipeline = [];
    const lookupPipeline = [];

    lookupPipeline.push({ $match: { $expr: { $in: ['$_id', '$$currentSongId'] } } });
    lookupPipeline.push({ $group: { _id: null, duration: { $sum: '$duration' } } });
    lookupPipeline.push({ $project: { duration: 1 } });

    pipeline.push({ $addFields: { duration: '$song_ids' } });
    pipeline.push({ $lookup: { from: 'songs', as: 'duration', let: { currentSongId: '$duration' }, pipeline: lookupPipeline } });
    pipeline.push({ $addFields: { duration: { $arrayElemAt: ['$duration.duration', 0] } } });

    return await playlistModel.aggregate(pipeline).catch((err) => ({ status: 500, err }));
};

// TODO: OK
const GetByIdWithDuration = async (playlistId) => {
    if (!playlistId) {
        return { status: 400, message: 'bad params' };
    }

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId);
    if (!isIdValid) {
        return { status: 400, message: 'invalid id' };
    }
    const validPlaylistId = mongoose.Types.ObjectId(playlistId);

    const pipeline = [];
    const lookupPipeline = [];

    lookupPipeline.push({ $match: { $expr: { $in: ['$_id', '$$currentSongId'] } } });
    lookupPipeline.push({ $group: { _id: null, duration: { $sum: '$duration' } } });
    lookupPipeline.push({ $project: { duration: 1 } });

    pipeline.push({ $match: { $expr: { $eq: ['$_id', validPlaylistId] } } });
    pipeline.push({ $addFields: { duration: '$song_ids' } });
    pipeline.push({ $lookup: { from: 'songs', as: 'duration', let: { currentSongId: '$duration' }, pipeline: lookupPipeline } });
    pipeline.push({ $addFields: { duration: { $arrayElemAt: ['$duration.duration', 0] } } });

    return await playlistModel.aggregate(pipeline).catch((err) => ({ status: 500, err }));
};

const CreateMany = async (playlistsData) => {
    if (!playlistsData || typeof playlistsData !== 'object' || !playlistsData.length) {
        return { status: 400, message: 'bad params' };
    }

    const result = [];

    for (let playlistData of playlistsData) {
        if (!Object.keys(playlistData).length) {
            return { status: 400, message: 'bad params' };
        }
        const data = await playlistModel.create({ ...playlistData, songs: [] }).catch((err) => ({ status: 500, err }));

        result.push(data);
    }
    return result;
};

const UpdateById = async (playlistId, playlistData) => {
    if (!playlistId || !playlistData || typeof playlistData !== 'object' || !Object.keys(playlistData).length) {
        return { status: 400, message: 'bad params' };
    }

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId);
    if (!isIdValid) {
        return { status: 400, message: 'invalid ID' };
    }
    const validPlaylistId = mongoose.Types.ObjectId(playlistId);

    if (playlistData.songs) {
        const removedSong = await songModel
            .updateMany({ playlist: validPlaylistId }, { $unset: { playlist: '' } })
            .catch((err) => ({ status: 500, err }));

        if (removedSong.err) return [removedSong.status, removedSong.err];

        for (let songId of playlistData.songs) {
            if (!songId) {
                return { status: 400, message: 'bad params' };
            }

            const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
            if (!isSongIdValid) {
                return { status: 400, message: 'invalid ID' };
            }
            const validSongId = mongoose.Types.ObjectId(songId);

            await songModel.findByIdAndUpdate(validSongId, { $set: { playlist: validPlaylistId } }).catch((err) => ({ status: 500, err }));
        }
    }

    return await playlistModel
        .findByIdAndUpdate(validPlaylistId, { ...playlistData }, { new: true })
        .catch((err) => ({ status: 500, err }));
};

const DeleteById = async (playlistId) => {
    if (!playlistId) {
        return { status: 400, message: 'bad params' };
    }

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId);
    if (!isIdValid) {
        return { status: 400, message: 'invalid ID' };
    }
    const validPlaylistId = mongoose.Types.ObjectId(playlistId);

    await songModel.updateMany({ playlist: validPlaylistId }, { $unset: { playlist: '' } }).catch((err) => ({ status: 500, err }));

    return await playlistModel.findByIdAndDelete(validPlaylistId).catch((err) => ({ status: 500, err }));
};

const AddSongs = async (playlistId, songsData) => {
    if (!playlistId || !songsData || typeof songsData !== 'object' || !songsData.length) {
        return { status: 400, message: 'bad params' };
    }

    const isIdValid = mongoose.Types.ObjectId.isValid(playlistId);
    if (!isIdValid) {
        return { status: 400, message: 'Invalid ID' };
    }
    const validPlaylistId = mongoose.Types.ObjectId(playlistId);
    const validSongIds = new Set();

    for (let songId of songsData) {
        if (!songId) {
            return { status: 400, message: 'bad params' };
        }

        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
        if (!isSongIdValid) {
            return { status: 400, message: 'Invalid ID' };
        }
        const validSongId = mongoose.Types.ObjectId(songId);

        await songModel.findByIdAndUpdate(validSongId, { $set: { playlist: validPlaylistId } }).catch((err) => ({ status: 500, err }));

        validSongIds.add(validSongId);
    }

    const validSongIdArray = Array.from(validSongIds);

    return await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $addToSet: { song_ids: validSongIdArray } }, { new: true })
        .catch((err) => ({ status: 500, err }));
};

const RemoveSongs = async (playlistId, songsData) => {
    if (!playlistId || !songsData || typeof songsData !== 'object' || !songsData.length) {
        return { status: 400, message: 'bad params' };
    }

    const isPlaylistIdValid = mongoose.Types.ObjectId.isValid(playlistId);
    if (!isPlaylistIdValid) {
        return { status: 400, message: 'Invalid ID' };
    }
    const validPlaylistId = mongoose.Types.ObjectId(playlistId);

    for (let songId of songsData) {
        if (!songId) {
            return { status: 400, message: 'bad params' };
        }

        const isSongIdValid = mongoose.Types.ObjectId.isValid(songId);
        if (!isSongIdValid) {
            return { status: 400, message: 'Invalid ID' };
        }
        const validSongId = mongoose.Types.ObjectId(songId);

        await songModel.findByIdAndUpdate(validSongId, { $unset: { playlist: '' } }).catch((err) => ({ status: 500, err }));
    }

    return await playlistModel
        .findByIdAndUpdate(validPlaylistId, { $pull: { song_ids: { $in: songsData } } }, { new: true })
        .catch((err) => ({ status: 500, err }));
};

module.exports = {
    GetAll,
    GetAllByIds,
    GetAllWithDuration,
    GetById,
    GetByIdWithDuration,
    CreateMany,
    UpdateById,
    DeleteById,
    AddSongs,
    RemoveSongs,
};
