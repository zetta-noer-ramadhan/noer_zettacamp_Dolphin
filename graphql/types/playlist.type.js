const { gql } = require('apollo-server-express')

const playlistType = gql`#graphql
    type Playlist {
        _id: ID
        name: String
        songs: [Song]
    }

    input PlaylistData {
        name: String
        songs: [String]
    }

    extend type Query {
        getAllPlaylists: [Playlist]
        getPlaylistById(playlistId: ID): Playlist
    }

    extend type Mutation {
        createPlaylists(playlistsData: [PlaylistData]): [Playlist]
        updatePlaylistById(playlistId: ID, playlistData: PlaylistData): Playlist
        deletePlaylistById(playlistId: ID): Playlist
        addSongsToPlaylist(playlistId: ID, songsData: [String]): Playlist
        removeSongsFromPlaylist(playlistId: ID, songsData: [String]): Playlist
    }
`

module.exports = playlistType