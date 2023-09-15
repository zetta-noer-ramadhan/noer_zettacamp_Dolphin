const express = require('express')
const app = express()
const port = 3000

const events = require('events')
const eventEmitter = new events.EventEmitter()

const AuthRoute = require('./route/auth.route')
const PlaylistRoute = require('./route/playlist.route')

const { seed } = require('./helper/util')

app.use(express.json())

app.use((err, req, res, next) => {
    return res.status(err.status).json({
        message: err.type,
        detail: err.message
    })
})

app.use(AuthRoute)
app.use(PlaylistRoute)

app.use((req, res, next) => {
    return res.status(404).json({
        message: 'not found'
    })
})

app.listen(port, () => {
    eventEmitter.emit('start', port)
})

eventEmitter.on('start', (port) => {
    seed()
    console.log(`Listening on ${port}`)
})