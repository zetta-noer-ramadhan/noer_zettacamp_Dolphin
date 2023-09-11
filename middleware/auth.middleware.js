
const CheckAuthentication = (req, res, next) => {

    const authorizaztionHeaders = req.headers["authorization"]

    if (!authorizaztionHeaders) {
        return res.status(401).json({
            message: 'Access Denied',
            detail: 'no auth header'
        })
    }

    const [authType, usernameAndPassword] = authorizaztionHeaders.split(" ");

    if (authType !== 'Basic') {
        return res.status(401).json({
            message: 'Access Denied',
            detail: 'wrong auth type'
        })
    }

    const [username, password] = Buffer.from(usernameAndPassword, "base64").toString("ascii").split(':')

    if (!username || !password) {
        return res.status(401).json({
            message: 'Access Denied',
            detail: 'no username or password'
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

    req.user = {
        username,
        password
    }

    return next()
}

module.exports = CheckAuthentication