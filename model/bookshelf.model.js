const mongoose = require('mongoose')

const bookshelfSchema = new mongoose.Schema({
    name: {
        type: String
    },
    books_id: [
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
    officers: [
        {
            name: {
                type: String
            },
            age: {
                type: String
            }
        }
    ]
})

const bookshelfModel = mongoose.model('Bookshelf', bookshelfSchema)

module.exports = bookshelfModel