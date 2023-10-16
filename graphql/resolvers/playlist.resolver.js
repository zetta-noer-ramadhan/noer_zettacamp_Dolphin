const moment = require('moment');
const fetch = require('node-fetch');
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

const GetAllPlaylistsGroupBy = async (_, { song_field }) => {
    const accessTime = moment();

    const data = await songService.GetAllGroupByField(song_field);
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime);
};

const GetAllPlaylistsGroupByGenres = async () => {
    return await GetAllPlaylistsGroupBy(null, { song_field: 'genre' });
};

const GetAllPlaylistsGroupByArtists = async () => {
    return await GetAllPlaylistsGroupBy(null, { song_field: 'artist_name' });
};

const GetRandomPlaylist = async () => {
    const accessTime = moment();

    const data = await songService.GetRandomGroupOneHour();
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime)[0];
};

const GetAllPlaylistsWithDuration = async () => {
    const accessTime = moment();

    const data = await playlistService.GetAllWithDuration();
    if (data && data.err) throw new ApolloError(data.err);

    return TimeHelper(data, accessTime, [0]);
};

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

// new resolver function for CreatePlaylistWebhook mutation
// that accept an array of playlist data
// that will be used on request to webhook
const CreatePlaylistWebhook = async (_, { playlists_data }) => {
    // check if
    // - playlists_data exist and not null
    // - playlists_data length is greater than 0
    if (!playlists_data || !playlists_data.length) {
        throw new ApolloError('bad params: playlists_data');
    }

    // iterate the playlists_data
    playlists_data.forEach((playlist) => {
        // check if
        // - playlist is exist and not null
        if (!playlist) {
            throw new ApolloError('bad params: playlists_data[i]');
        }

        // deconstruct the playlist's field
        const { playlist_name, description, creator, song_list, total_favourite } = playlist;

        // check if
        // - playlist_name is exist and not null
        // - description is exist and not null
        // - creator is exist and not null
        // - total_favourite is exist and not null
        // - song_list is exist and not null
        // - song_list length is greater than 0
        if (!playlist_name || !description || !creator || !total_favourite || !song_list || !song_list.length) {
            throw new ApolloError('bad params: playlists_data[i].field');
        }

        // iterate the playlist's song_list
        song_list.forEach((song) => {
            // check if
            // - song is exist and not null
            if (!song) {
                throw new ApolloError('bad params: playlists_data[i].song_lists[j]');
            }

            // deconstruct the playlist's song_list's field
            const { title, artist_name, album_name, year, genre, duration } = song;

            // check if
            // - title is exist and not null
            // - artist_name is exit and not null
            // - album_name is exist and not null
            // - year is exist and not null
            // - genre is exist and not null
            // - duration is exist and not null
            if (!title || !artist_name || !album_name || !year || !genre || !duration) {
                throw new ApolloError('bad params: playlists_data[i].song_list[j].field');
            }
        });
    });

    // configuration for webhook request
    const config = {
        webhook_url: 'https://webhook.site/c430248a-7817-4d52-b011-0bc6132e2ca1',
        options: {
            method: 'POST',
            body: JSON.stringify(playlists_data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    };

    // send an asynchronous request to webhook with the provided configuration
    return await fetch(config.webhook_url, config.options)
        // parse the body text as json which resolves to an object
        .then((data) => {
            if (!data) {
                throw new ApolloError('error in response');
            }
            return data.json();
            /*
            alternative:
            - check response for response.ok, response.status, response.statusText
            - so we don't need to worry about the existence of response body and its json parsing
            */
        })
        .catch((err) => {
            throw new ApolloError(err);
        });
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
        CreatePlaylistWebhook,
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
