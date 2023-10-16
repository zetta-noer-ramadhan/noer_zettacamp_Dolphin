const mongoose = require('mongoose');
const moment = require('moment');

const config = {
    protocol: 'mongodb',
    hostname: 'localhost',
    port: 27017,
    database: 'zc-lib-webhook-final',
};

const DB_URI = `${config.protocol}://${config.hostname}:${config.port}/${config.database}`;

const connect = () => {
    const timestamp = moment().format('HH:mm:ss');
    return mongoose
        .connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log(timestamp, 'connected to database');
        })
        .catch((err) => {
            console.log(timestamp, 'error while connecting to database', err);
        });
};

module.exports = {
    connect,
    mongoose,
};
