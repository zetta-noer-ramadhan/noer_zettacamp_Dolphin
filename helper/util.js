const CheckType = (data, type) => Object.entries(data).filter(([key]) => typeof data[key] !== type[key]).length === 0

const ObjectFilterByProperty = (object, arrayOfProperties) => arrayOfProperties.reduce((result, currentKey) => {
    const { [currentKey]: value } = object
    return !value ? {} : { ...result, [currentKey]: value }
}, {})

const ErrorHandler = (err, req, res, next) => res.status(err.statusCode).json({
    message: err.type,
    detail: err.message
})

const RouteErrorHandler = (req, res, next) => res.status(404).json({
    message: 'Not Found',
    detail: req.path + ' not found'
})

const errorHelper = (status, err) => [status, {
    message: err.message,
    detail: err
}]

const fieldBuilder = (allFields, excludedFields) => allFields.filter(field => !excludedFields.includes(field))

module.exports = {
    CheckType,
    ErrorHandler,
    RouteErrorHandler,
    ObjectFilterByProperty,
    errorHelper,
    fieldBuilder
}