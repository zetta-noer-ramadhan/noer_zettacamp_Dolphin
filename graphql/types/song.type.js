const { gql } = require('apollo-server-express')

const songType = gql`#graphql
    type Song {
        _id: ID
        title: String
        artist: String
        album: String
        genre: [String]
        year: Int
        duration: Int
        playlist: Playlist
    }

    input SongData {
        title: String
        artist: String
        album: String
        genre: [String]
        year: Int
        duration: Int
        playlist: String
    }

    extend type Query {
        getAllSongs: [Song]
        getSongById(songId: ID): Song
    }

    extend type Mutation {
        createSongs(songsData: [SongData]): [Song]
        updateSongById(songId: ID, songData: SongData): Song
        deleteSongById(songId: ID): Song
    }
`

module.exports = songType