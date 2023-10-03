const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: [
        {
            type: String,
            required: true
        }
    ],
    duration: {
        type: Number,
        required: true
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }
})

const songModel = mongoose.model('Song', songSchema)

module.exports = songModel