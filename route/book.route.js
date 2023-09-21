const router = require('express').Router()
const middleware = require('../middleware/auth.middleware')
const bookService = require('../service/book.service')


router.get('/books/projection', middleware, async (req, res) => {
    const [status, data] = await bookService.projection(req.body.fields)
    return res.status(status).json(data)
})

router.get('/books/addFields', middleware, async (req, res) => {
    const [status, data] = await bookService.addFields()
    return res.status(status).json(data)
})

router.get('/books/:id/addFields', middleware, async(req, res) => {
    const [status, data] = await bookService.addFieldsOne(req.params.id)
    return res.status(status).json(data)
})






router.post('/books', middleware, async (req, res) => {
    const [status, data] = await bookService.createOne(req.body)
    return res.status(status).json(data)
})

router.get('/books', middleware, async (req, res) => {
    const [status, data] = await bookService.readAll()
    return res.status(status).json(data)
})

router.get('/books/:id', middleware, async (req, res) => {
    const [status, data] = await bookService.readOne(req.params.id)
    return res.status(status).json(data)
})

router.put('/books/:id', middleware, async (req, res) => {
    const [status, data] = await bookService.updateOne(req.params.id, req.body)
    return res.status(status).json(data)
})

router.delete('/books', middleware, async (req, res) => {
    const [status, data] = await bookService.deleteAll()
    return res.status(status).json(data)
})

router.delete('/books/:id', middleware, async (req, res) => {
    const [status, data] = await bookService.deleteOne(req.params.id)
    return res.status(status).json(data)
})

module.exports = router