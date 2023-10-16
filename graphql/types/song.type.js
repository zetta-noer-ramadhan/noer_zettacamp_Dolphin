const { gql } = require('apollo-server-express');

const songType = gql`
    #graphql
    type Song {
        _id: ID
        title: String
        artist_name: String
        album_name: String
        genre: [String]
        year: String
        duration: Int
        playlist_id: Playlist
    }

    input SongData {
        title: String
        artist_name: String
        album_name: String
        genre: [String]
        year: String
        duration: Int
        playlist_id: ID
    }

    extend type Query {
        GetAllSongs: [Song]
        GetSongById(song_id: ID): Song
    }

    extend type Mutation {
        CreateSongs(songs_data: [SongData]): [Song]
        UpdateSongById(song_id: ID, song_data: SongData): Song
        DeleteSongById(song_id: ID): Song
        CronJobTriggerManual(job_name: String): String
    }
`;

module.exports = songType;
