const router = require('express').Router()
const service = require('../service/playlist.service')
const { checkAuthentication } = require('../middleware/auth.middleware')

router.get('/groupByArtist', checkAuthentication, (req, res) => {
    const [status, data] = service.groupByArtist()
    return res.status(status).json(data)
})

router.get('/groupByGenre', checkAuthentication, (req, res) => {
    const [status, data] = service.groupByGenre()
    return res.status(status).json(data)
})

router.get('/groupByDuration', checkAuthentication, (req, res) => {
    const [status, data] = service.groupByDuration()
    return res.status(status).json(data)
})

module.exports = router