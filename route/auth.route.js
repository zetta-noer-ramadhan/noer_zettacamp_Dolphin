const router = require('express').Router()
const { generateToken } = require('../middleware/auth.middleware')

const events = require('events')
const eventEmitter = new events.EventEmitter()

router.post('/login', (req, res) => {
    eventEmitter.emit('request', req.method, req.path)

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: 'Bad Request',
            detail: 'wrong parameter(s) format'
        })
    }

    const config = {
        username: "uname",
        password: "pword"
    }

    if (username !== config.username || password !== config.password) {
        return res.status(401).json({
            message: 'Access Denied',
            detail: 'wrong username or password'
        })
    }

    const token = generateToken(username)

    return res.status(200).json({
        token
    })
})

eventEmitter.on('request' , (method, source) => {
    console.log(method, source, '\t\t\t', new Date().toTimeString())
})

module.exports = router