const jwt = require('jsonwebtoken')
const secret = 'passwhat'

const events = require('events')
const eventEmitter = new events.EventEmitter()

const generateToken = (params) => {
    return jwt.sign(
        { id: params },
        secret,
        {
            expiresIn: '1h'
        }
    )
}

const checkAuthentication = (req, res, next) => {
    eventEmitter.emit('request', req.method, req.path)

    const authorizaztionHeaders = req.headers["authorization"]

    if (!authorizaztionHeaders) return res.status(401).json({
        message: 'Access Denied',
        detail: 'no auth header'
    })

    const [authType, token] = authorizaztionHeaders.split(" ");

    if (authType !== 'Bearer') return res.status(401).json({
        message: 'Access Denied',
        detail: 'wrong auth type'
    })

    if (!token) return res.status(401).json({
        message: 'Access Denied',
        detail: 'token undefined'
    })

    return jwt.verify(token, secret, (err, decoded) => {

        if (err) {
            // eventEmitter.emit('authBad', { token })
            return res.status(403).json({
                message: 'Forbidden',
                detail: err.message
            })
        }

        // eventEmitter.emit('authGood', { token, decoded })
        return next()
    })
}

eventEmitter.on('check', () => {
    console.log('checking authentication')
})

eventEmitter.on('authBad', (token) => {
    console.log('auth failed', token)
})

eventEmitter.on('authGood', (data) => {
    console.log('auth success', data)
})

eventEmitter.on('request', (method, source) => {
    console.log(method, source, '\t\t', new Date().toTimeString())
})


module.exports = {
    generateToken, checkAuthentication
}