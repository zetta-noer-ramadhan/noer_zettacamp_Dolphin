const mongoose = require('mongoose')

const bookshelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }
    ],
    genres: [
        {
            type: String,
        }
    ],
    officer: [
        {
            name: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            }
        }
    ]
})

const bookshelfModel = mongoose.model('Bookshelf', bookshelfSchema)

module.exports = bookshelfModel