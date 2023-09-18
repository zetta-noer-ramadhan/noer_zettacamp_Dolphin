const router = require('express').Router()
const middleware = require('../middleware/auth.middleware')
const service = require('../service/book.service')

router.post('/bookPurchase', middleware, async (req, res) => {
    const [status, data] = await service.BookPurchase(req)
    return res.status(status).json(data)
})




router.post('/books', middleware, async (req, res) => {
    const [status, data] = await service.BookService.createOne(req.body)
    return res.status(status).json(data)
})

router.get('/books', middleware, async (req, res) => {
    const [status, data] = await service.BookService.readAll()
    return res.status(status).json(data)
})

router.get('/books/:id', middleware, async (req, res) => {
    const [status, data] = await service.BookService.readOne(req.params.id)
    return res.status(status).json(data)
})

router.put('/books/:id', middleware, async (req, res) => {
    const [status, data] = await service.BookService.updateOne(req.params.id, req.body)
    return res.status(status).json(data)
})

router.delete('/books', middleware, async (req, res) => {
    const [status, data] = await service.BookService.deleteAll()
    return res.status(status).json(data)
})

router.delete('/books/:id', middleware, async (req, res) => {
    const [status, data] = await service.BookService.deleteOne(req.params.id)
    return res.status(status).json(data)
})

module.exports = router