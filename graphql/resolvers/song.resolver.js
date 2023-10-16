const { ApolloError } = require('apollo-server-express');
const service = require('../../service/song.service');

const GetAllSongs = async () => {
    const data = await service.GetAll();
    if (!data) throw new ApolloError('something is not right');
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const GetSongById = async (_, { song_id }, context) => {
    try {
        const data = await context.songLoader.load(song_id);
        return data;
    } catch (error) {
        throw new ApolloError(error);
    }
};

const CreateSongs = async (_, { songs_data }) => {
    const data = await service.CreateMany(songs_data);
    if (!data) throw new ApolloError('something is not right');
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const UpdateSongById = async (_, { song_id, song_data }) => {
    const data = await service.UpdateById(song_id, song_data);
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const DeleteSongById = async (_, { song_id }) => {
    const data = await service.DeleteById(song_id);
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const { jobsFunctionList } = require('../../cron/index.job');

const CronJobTriggerManual = async (_, { job_name }) => {
    if (!Object.keys(jobsFunctionList).length) {
        return 'no job';
    }

    if (!job_name) {
        return 'no job name';
    }

    try {
        const jobFunction = jobsFunctionList[job_name];

        if (!jobFunction) {
            return job_name + ' not found';
        }

        await jobFunction();
        return job_name + ' triggered';
    } catch (error) {
        throw new ApolloError(error);
    }
};

const Playlist = async (parent, _, context) => {
    if (!parent || !parent.playlist_id) {
        return null;
    }
    if (!context || !context.playlistLoader) {
        throw new ApolloError('no context');
    }

    try {
        const data = await context.playlistLoader.load(parent.playlist_id);
        return data;
    } catch (error) {
        throw new ApolloError(error);
    }
};

module.exports = {
    query: {
        GetAllSongs,
        GetSongById,
    },
    mutation: {
        CreateSongs,
        UpdateSongById,
        DeleteSongById,
        CronJobTriggerManual,
    },
    main: {
        Song: {
            playlist_id: Playlist,
        },
    },
};
