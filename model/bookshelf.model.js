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
    ]
})

const bookshelfModel = mongoose.model('Bookshelf', bookshelfSchema)

module.exports = bookshelfModel