const router = require('express').Router()
const playlistService = require('../service/playlist.service')



// using aggregation on playlists collection
router.get('/playlists', async (req, res) => {
    const [status, data] = await playlistService.getPlaylistsQuery(req.query.id, req.query.size, req.query.page)
    return res.status(status).json(data)
})



// get playlists
router.get('/playlists/noAggregate', async (req, res) => {
    const [status, data] = await playlistService.getPlaylists()
    return res.status(status).json(data)
})



// get a playlist by id
router.get('/playlists/:id', async (req, res) => {
    const [status, data] = await playlistService.getPlaylistById(req.params.id)
    return res.status(status).json(data)
})



// create a playlist
router.post('/playlists', async (req, res) => {
    const [status, data] = await playlistService.createPlaylist(req.body)
    return res.status(status).json(data)
})



// add songs to a playlist
router.post('/playlists/:id', async (req, res) => {
    const [status, data] = await playlistService.addPlaylistSongs(req.params.id, req.body.songIds)
    return res.status(status).json(data)
})



// update a playlist by id
router.put('/playlists/:id', async (req, res) => {
    const [status, data] = await playlistService.updatePlaylistById(req.params.id, req.body)
    return res.status(status).json(data)
})



// delete playlists
router.delete('/playlists', async (req, res) => {
    const [status, data] = await playlistService.deletePlaylists()
    return res.status(status).json(data)
})



// delete a playlist by id
router.delete('/playlists/:id', async (req, res) => {
    const [status, data] = await playlistService.deletePlaylistById(req.params.id)
    return res.status(status).json(data)
})



// remove songs from a playlist by id
router.delete('/playlists/:id/songs', async (req, res) => {
    const [status, data] = await playlistService.removePlaylistSongs(req.params.id)
    return res.status(status).json(data)
})



// remove a song by id from a playlist by id
router.delete('/playlists/:playlistId/songs/:songId', async (req, res) => {
    const [status, data] = await playlistService.removePlaylistSongById(req.params.playlistId, req.params.songId)
    return res.status(status).json(data)
})

module.exports = router