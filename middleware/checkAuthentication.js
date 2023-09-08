const { ResponseHelper } = require('../helper/util')

const CheckAuthentication = (req, res, next) => {
    const authorizaztionHeaders = req.headers["authorization"]

    if (!authorizaztionHeaders){
        return ResponseHelper(res, 401, "Access Denied", {
            detail: "no auth header"
        })
    }

    const usernameAndPassword = authorizaztionHeaders.split(" ")[1];
    const usernameAndPasswordDecoded = Buffer.from(usernameAndPassword, "base64").toString("ascii").split(':');

    const [username, password] = usernameAndPasswordDecoded

    if (!username || !password) {
        return ResponseHelper(res, 401, "Access Denied", {
            detail: "no username or password"
        })
    }

    const config = {
        username: "uname",
        password: "pword"
    }

    if (username !== config.username || password !== config.password) {
        return ResponseHelper(res, 401, "Access Denied", {
            detail: "wrong username or password"
        })
    }

    req.user = {
        username,
        password
    }

    return next()
}

module.exports = CheckAuthentication