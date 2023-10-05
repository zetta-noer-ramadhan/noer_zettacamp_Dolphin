const router = require('express').Router()
const middleware = require('../middleware/auth.middleware').CheckAuthentication
const bookService = require('../service/book.service')


// router.get('/books/pagination', middleware, async (req, res) => {
//     const [status, data] = await bookService.Pagination(req.query.size, req.query.page)
//     return res.status(status).json(data)
// })

// router.get('/books/sort', middleware, async (req, res) => {
//     const [status, data] = await bookService.Sort()
//     return res.status(status).json(data)
// })



// router.get('/books/aggregate', middleware, async (req, res) => {
//     const [status, data] = await bookService.Aggregate(req.body.match, req.body.sort)
//     return res.status(status).json(data)
// })



// router.get('/books/projection', middleware, async (req, res) => {
//     const [status, data] = await bookService.Projection(req.body.fields)
//     return res.status(status).json(data)
// })

// router.get('/books/addFields', middleware, async (req, res) => {
//     const [status, data] = await bookService.AddFields()
//     return res.status(status).json(data)
// })

// router.get('/books/:id/addFields', middleware, async(req, res) => {
//     const [status, data] = await bookService.AddFieldsOne(req.params.id)
//     return res.status(status).json(data)
// })



router.post('/books', middleware, async (req, res) => {
    const [status, data] = await bookService.CreateOne(req.body)
    return res.status(status).json(data)
})

router.get('/books', middleware, async (req, res) => {
    const [status, data] = await bookService.GetMany()
    return res.status(status).json(data)
})

router.get('/books/:id', middleware, async (req, res) => {
    const [status, data] = await bookService.GetOne(req.params.id)
    return res.status(status).json(data)
})

router.put('/books/:id', middleware, async (req, res) => {
    const [status, data] = await bookService.UpdateOne(req.params.id, req.body)
    return res.status(status).json(data)
})

router.delete('/books/:id', middleware, async (req, res) => {
    const [status, data] = await bookService.DeleteOne(req.params.id)
    return res.status(status).json(data)
})

module.exports = router