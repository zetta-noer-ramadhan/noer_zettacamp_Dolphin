const ResponseHelper = (response, statusCode, message, data) => {
    if (!data) return response.status(statusCode).json({
        message
    })
    return response.status(statusCode).json({
        message,
        data
    })
}

const CheckType = (data, type) => {
    for (let key in data) {
        if (typeof data[key] !== type[key]) return false
    }
    return true
}

module.exports = {
    ResponseHelper,
    CheckType
}