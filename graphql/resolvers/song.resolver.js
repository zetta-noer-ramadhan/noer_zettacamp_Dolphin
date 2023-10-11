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
    },
    main: {
        Song: {
            playlist_id: Playlist,
        },
    },
};
