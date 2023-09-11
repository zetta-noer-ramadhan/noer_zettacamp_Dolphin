const CheckType = (data, type) => {
    for (let key in data) {
        if (typeof data[key] !== type[key]) return false
    }
    return true
}

const ObjectFilterByProperty = (object, arrayOfProperties) => arrayOfProperties.reduce((result, currentKey) => {
    const { [currentKey]: value } = object
    return { ...result, [currentKey]: value }
}, {})

const ErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode).json({
        message: err.type,
        detail: err.message
    })
}

const RouteErrorHandler = (req, res, next) => {
    return res.status(404).json({
        message: 'Not Found',
        detail: req.path + ' not found'
    })
}

module.exports = {
    CheckType,
    ErrorHandler,
    RouteErrorHandler,
    ObjectFilterByProperty
}