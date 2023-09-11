const router = require('express').Router()
const middleware = require('../middleware/auth.middleware')
const service = require('../service/book.service')

router.post('/bookPurchase', middleware, async (req, res) => {
    const [status, data] = await service.BookPurchase(req, res)
    return res.status(status).json(data)
})

router.post('/calculateTerm', middleware, async (req, res) => {

    const { price, duration, additional } = req.body

    try {

        if (!price || !duration) {
            throw new Error('wrong parameter format. (missing parameter)')
        }

        if (typeof price !== 'number' || typeof duration !== 'number') {
            throw new Error('wrong parameter format. (wrong parameter data type)')
        }

        if (additional) {
            if (typeof additional !== 'object') {
                throw new Error('wrong parameter format. (wrong parameter data type)')
            }

            if (!additional?.term || !additional?.amount) {
                throw new Error('wrong parameter format. (missing parameters)')
            }

            if (typeof additional?.term !== 'number' || typeof additional?.amount !== 'number') {
                throw new Error('wrong parameter format. (wrong parameter data type)')
            }

            if (additional?.term === 0 || additional?.term > duration) {
                throw new Error('wrong parameter format. (term cannot be zero or greater than duration)')
            }
        }



        const creditDetail = await service.CalculateTerm(price, duration, additional)

        return res.status(200).json(creditDetail)

    } catch (error) {

        return res.status(400).json({
            message: 'error',
            detail: error.message
        })
    }
})

module.exports = router