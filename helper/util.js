const bcrypt = require('bcrypt');
const moment = require('moment');

const FieldBuilder = (allFields, excludedFields) => allFields.filter((field) => !excludedFields.includes(field));

const HashPassword = async (password) =>
    await bcrypt
        .hash(password, 10)
        .then((hash) => hash)
        .catch((err) => err);

const CheckPassword = async (password, hashedPassword) =>
    await bcrypt
        .compare(password, hashedPassword)
        .then((data) => data)
        .catch((err) => err);

const RandomizeIndex = (maxIndex) => Math.floor(Math.random() * maxIndex);

const TimeHelper = (data, accessTime) =>
    data.map((item) => {
        const durationMoment = moment.duration(item.duration, 'second');

        item.start_time = accessTime.format('dddd, LL LTS');
        item.duration = `${durationMoment.hours()}h ${durationMoment.minutes()}m ${durationMoment.seconds()}s`;
        item.end_time = accessTime.clone().add(durationMoment).format('dddd, LL LTS');

        return item;
    });

const ErrorHandler = (err, req, res) =>
    res.status(err.statusCode).json({
        message: err.type,
        detail: err.message,
    });

const RouteErrorHandler = (req, res) =>
    res.status(404).json({
        message: 'Not Found',
        detail: req.path + ' not found',
    });

module.exports = {
    FieldBuilder,
    HashPassword,
    CheckPassword,
    RandomizeIndex,
    TimeHelper,
    ErrorHandler,
    RouteErrorHandler
};
