const router = require('express').Router()
const middleware = require('../middleware/auth.middleware').CheckAuthentication
const bookshelfService = require('../service/bookshelf.service')



// router.get('/bookshelves/:id/aggregate', middleware, async (req, res) => {
//     const [status, data] = await bookshelfService.Aggregate(req.params.id)
//     return res.status(status).json(data)
// })



// router.get('/bookshelves/:id/unwind', middleware, async (req, res) => {
//     const [status, data] = await bookshelfService.Unwind(req.params.id)
//     return res.status(status).json(data)
// })



// router.get('/bookshelves/elemMatch', middleware, async (req, res) => {
//     const { name, age } = req.body
//     const [status, data] = await bookshelfService.ElemMatch(name, age)
//     return res.status(status).json(data)
// })

// router.post('/bookshelves/arrayFilters', middleware, async (req, res) => {
//     const { bookshelfId, name, age } = req.body
//     const [status, data] = await bookshelfService.ArrayFilters(bookshelfId, name, age)
//     return res.status(status).json(data)
// })

// router.get('/bookshelves/:id/genre/distinct', middleware, async (req, res) => {
//     const [status, data] = await bookshelfService.Distinct(req.params.id)
//     return res.status(status).json(data)
// })



// create a bookshelf; OK
router.post('/bookshelves', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.CreateOne(req.body.name, req.body.officer)
    return res.status(status).json(data)
})

// insert books to a bookshelf; OK
router.post('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.Insert(req.params.id, req.body)
    return res.status(status).json(data)
})

// get all bookshelf that contain a book with certain id; OK, single id
// get all bookshelves; OK
// with query
// router.get('/bookshelves', middleware, async (req, res) => {
//     if (Object.keys(req.query).length > 0 && !req.query.bookId) {
//         return res.status(400).json({ message: 'wrong query parameter' })
//     }

//     const [status, data] = req.query.bookId
//         ? await bookshelfService.GetBookshelvesFilter(req.query.bookId)
//         : await bookshelfService.GetMany()

//     return res.status(status).json(data)
// })

// get a bookshelf; OK
router.get('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.GetOne(req.params.id)
    return res.status(status).json(data)
})

// update a bookshelf (name only); OK
// router.put('/bookshelves/:id', middleware, async (req, res) => {
//     const [status, data] = await bookshelfService.Update(req.params.id, req.body.name)
//     return res.status(status).json(data)
// })

// delete a bookshelf; OK
router.delete('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.DeleteOne(req.params.id)
    return res.status(status).json(data)
})

// remove all books from a bookshelf; OK
router.delete('/bookshelves/:id/books', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.RemoveMany(req.params.id)
    return res.status(status).json(data)
})

// remove a book from a bookshelf; OK
router.delete('/bookshelves/:bookshelfId/books/:bookId', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.RemoveOne(req.params.bookshelfId, req.params.bookId)
    return res.status(status).json(data)
})

module.exports = router