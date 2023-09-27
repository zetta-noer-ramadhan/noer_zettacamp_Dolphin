const router = require('express').Router()
const songService = require('../service/song.service')



// using aggregation on songs collection
router.get('/songs', async (req, res) => {
    const [status, data] = await songService.getSongsQuery(req.query.size, req.query.page)
    return res.status(status).json(data)
})



// get songs
router.get('/songs/noAggregate', async (req, res) => {
    const [status, data] = await songService.getSongs()
    return res.status(status).json(data)
})



// get a song by id
router.get('/songs/:id', async (req, res) => {
    const [status, data] = await songService.getSongById(req.params.id)
    return res.status(status).json(data)
})



// create a song
router.post('/songs', async (req, res) => {
    const [status, data] = await songService.createSong(req.body)
    return res.status(status).json(data)
})



// update a song by id
router.put('/songs/:id', async (req, res) => {
    const [status, data] = await songService.updateSongById(req.params.id, req.body)
    return res.status(status).json(data)
})



// delete songs
router.delete('/songs', async (req, res) => {
    const [status, data] = await songService.deleteSongs()
    return res.status(status).json(data)
})



// delete a song by id
router.delete('/songs/:id', async (req, res) => {
    const [status, data] = await songService.deleteSongById(req.params.id)
    return res.status(status).json(data)
})

module.exports = router