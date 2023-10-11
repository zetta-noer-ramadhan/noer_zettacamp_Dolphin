const { gql } = require('apollo-server-express');

const playlistType = gql`
    #graphql
    type Playlist {
        _id: ID
        name: String
        song_ids: [Song]
    }

    type PlaylistWithDuration {
        _id: ID
        name: String
        song_ids: [Song]
        duration: String
        start_time: String
        end_time: String
    }

    input PlaylistData {
        name: String
        song_ids: [String]
    }

    # new Type
    type SongWebhook {
        title: String
        artist_name: String
        album_name: String
        genre: String
        year: String
        duration: String
    }

    # new Type
    type PlaylistWebhook {
        playlist_name: String
        description: String
        creator: String
        song_list: [SongWebhook]
        total_favourite: String
    }

    # new Input
    input SongWebhookData {
        title: String
        artist_name: String
        album_name: String
        genre: String
        year: String
        duration: String
    }

    # new Input
    input PlaylistWebhookData {
        playlist_name: String
        description: String
        creator: String
        song_list: [SongWebhookData]
        total_favourite: String
    }

    enum SongField {
        title
        artist_name
        album_name
        genre
        year
    }

    extend type Query {
        GetAllPlaylists: [Playlist]
        GetPlaylistById(playlist_id: ID): Playlist
        GetAllPlaylistsGroupBy(song_field: SongField): [PlaylistWithDuration]
        GetAllPlaylistsGroupByGenres: [PlaylistWithDuration]
        GetAllPlaylistsGroupByArtists: [PlaylistWithDuration]
        GetRandomPlaylist: PlaylistWithDuration
        GetAllPlaylistsWithDuration: [PlaylistWithDuration]
        GetPlaylistByIdWithDuration(playlist_id: ID): PlaylistWithDuration
    }

    extend type Mutation {
        CreatePlaylists(playlists_data: [PlaylistData]): [Playlist]
        UpdatePlaylistById(playlist_id: ID, playlist_data: PlaylistData): Playlist
        DeletePlaylistById(playlist_id: ID): Playlist
        AddSongsToPlaylist(playlist_id: ID, songs_data: [ID]): Playlist
        RemoveSongsFromPlaylist(playlist_id: ID, songs_data: [ID]): Playlist
        # new Mutation
        CreatePlaylistWebhook(playlists_data: [PlaylistWebhookData]): [PlaylistWebhook]
    }
`;

module.exports = playlistType;
