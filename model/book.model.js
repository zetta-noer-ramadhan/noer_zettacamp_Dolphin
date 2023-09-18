const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    on_sale: {
        type: Boolean,
        required: true
    }
})

const bookModel = mongoose.model('Book', bookSchema)

module.exports = bookModel