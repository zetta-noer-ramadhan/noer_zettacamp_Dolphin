const router = require('express').Router()
const middleware = require('../middleware/auth.middleware')
const purchaseService = require('../service/purchase.service')

router.post('/bookPurchase', middleware, async (req, res) => {
    const [status, data] = await purchaseService(req)
    return res.status(status).json(data)
})

module.exports = router