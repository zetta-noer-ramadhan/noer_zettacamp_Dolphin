const router = require('express').Router()

const purchaseRoute = require('./purchase.route')
const bookRoute = require('./book.route')
const bookshelfRoute = require('./bookshelf.route')

router.use(purchaseRoute)
router.use(bookRoute)
router.use(bookshelfRoute)

module.exports = router