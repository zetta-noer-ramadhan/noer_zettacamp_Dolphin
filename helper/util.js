const bcrypt = require('bcrypt')

const ErrorHandler = (err, req, res, next) => res.status(err.statusCode).json({
    message: err.type,
    detail: err.message
})

const RouteErrorHandler = (req, res, next) => res.status(404).json({
    message: 'Not Found',
    detail: req.path + ' not found'
})

const FieldBuilder = (allFields, excludedFields) => allFields.filter(field => !excludedFields.includes(field))

const HashPassword = async (password) => await bcrypt.hash(password, 10).then(hash => hash).catch(err => err)

const CheckPassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword).then(data => data).catch(err => err)

module.exports = {
    ErrorHandler,
    RouteErrorHandler,
    FieldBuilder,
    HashPassword,
    CheckPassword
}