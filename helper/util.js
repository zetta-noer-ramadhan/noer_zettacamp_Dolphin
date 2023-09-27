const ErrorHandler = (err, req, res, next) => res.status(err.statusCode).json({
    message: err.type,
    detail: err.message
})

const RouteErrorHandler = (req, res, next) => res.status(404).json({
    message: 'Not Found',
    detail: req.path + ' not found'
})

module.exports = {
    ErrorHandler,
    RouteErrorHandler
}