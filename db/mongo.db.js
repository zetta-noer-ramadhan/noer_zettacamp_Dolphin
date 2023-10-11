const mongoose = require('mongoose');

const config = {
    protocol: 'mongodb',
    hostname: 'localhost',
    port: 27017,
    database: 'zc-lib-moment-final',
};

const DB_URI = `${config.protocol}://${config.hostname}:${config.port}/${config.database}`;

const connect = () =>
    mongoose
        .connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log('connected to database');
        })
        .catch((err) => {
            console.log('error while connecting to database', err);
        });

module.exports = {
    connect,
    mongoose,
};
