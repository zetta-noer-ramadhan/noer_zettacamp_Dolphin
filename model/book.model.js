const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    genre: [
        {
            type: String
        }
    ],
    price: {
        type: Number
    },
    on_sale: {
        type: Boolean
    }
})

const bookModel = mongoose.model('Book', bookSchema)

module.exports = bookModel