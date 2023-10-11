const moment = require('moment');
const { ApolloError } = require('apollo-server-express');
const playlistService = require('../../service/playlist.service');
const songService = require('../../service/song.service');
const { TimeHelper } = require('../../helper/util');

const GetAllPlaylists = async () => {
    const data = await playlistService.GetAll();
    if (!data) throw new ApolloError('something is not right');
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const GetPlaylistById = async (_, { playlist_id }, context) => {
    try {
        const data = await context.playlistLoader.load(playlist_id);
        return data;
    } catch (error) {
        throw new ApolloError(error);
    }
};

// TODO: OK
const GetAllPlaylistsGroupBy = async (_, { song_field }) => {
    const accessTime = moment();

    const data = await songService.GetAllGroupByField(song_field);
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime);
};

// TODO: OK
const GetAllPlaylistsGroupByGenres = async () => {
    return await GetAllPlaylistsGroupBy(null, { song_field: 'genre' });
};

// TODO: OK
const GetAllPlaylistsGroupByArtists = async () => {
    return await GetAllPlaylistsGroupBy(null, { song_field: 'artist_name' });
};

// TODO: OK
const GetRandomPlaylist = async () => {
    const accessTime = moment();

    const data = await songService.GetRandomGroupOneHour();
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime)[0];
};

// TODO: OK
const GetAllPlaylistsWithDuration = async () => {
    const accessTime = moment();

    const data = await playlistService.GetAllWithDuration();
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime, [0]);
};

// TODO: OK
const GetPlaylistByIdWithDuration = async (_, { playlist_id }) => {
    const accessTime = moment();

    const data = await playlistService.GetByIdWithDuration(playlist_id);
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime)[0];
};

const CreatePlaylists = async (_, { playlists_data }) => {
    const data = await playlistService.CreateMany(playlists_data);
    if (!data) throw new ApolloError('something is not right');
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const UpdatePlaylistById = async (_, { playlist_id, playlist_data }) => {
    const data = await playlistService.UpdateById(playlist_id, playlist_data);
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const DeletePlaylistById = async (_, { playlist_id }) => {
    const data = await playlistService.DeleteById(playlist_id);
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const AddSongsToPlaylist = async (_, { playlist_id, songs_data }) => {
    const data = await playlistService.AddSongs(playlist_id, songs_data);
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const RemoveSongsFromPlaylist = async (_, { playlist_id, songs_data }) => {
    const data = await playlistService.RemoveSongs(playlist_id, songs_data);
    if (data && data.err) throw new ApolloError(data.err);
    return data;
};

const Songs = async (parent, _, context) => {
    if (!parent || !parent.song_ids) {
        return null;
    }
    if (!context || !context.songLoader) {
        throw new ApolloError('no context');
    }

    try {
        const data = await context.songLoader.loadMany(parent.song_ids);
        return data;
    } catch (error) {
        throw new ApolloError(error);
    }
};

module.exports = {
    query: {
        GetAllPlaylists,
        GetPlaylistById,
        GetAllPlaylistsGroupBy,
        GetAllPlaylistsGroupByGenres,
        GetAllPlaylistsGroupByArtists,
        GetRandomPlaylist,
        GetAllPlaylistsWithDuration,
        GetPlaylistByIdWithDuration,
    },
    mutation: {
        CreatePlaylists,
        UpdatePlaylistById,
        DeletePlaylistById,
        AddSongsToPlaylist,
        RemoveSongsFromPlaylist,
    },
    main: {
        Playlist: {
            song_ids: Songs,
        },
        PlaylistWithDuration: {
            song_ids: Songs,
        },
    },
};
