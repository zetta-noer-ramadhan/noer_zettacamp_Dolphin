const router = require('express').Router()

const songRoute = require('./song.route')
const playlistRoute = require('./playlist.route')

router.use(songRoute)
router.use(playlistRoute)

module.exports = router