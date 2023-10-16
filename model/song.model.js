const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist_name: {
        type: String,
        required: true,
    },
    album_name: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    genre: [
        {
            type: String,
            required: true,
        },
    ],
    duration: {
        type: Number,
        required: true,
    },
    playlist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
    },
    played: {
        type: Boolean,
    },
});

module.exports = mongoose.model('Song', songSchema);
