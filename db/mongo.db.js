const mongoose = require('mongoose')

const config = {
    protocol: 'mongodb',
    hostname: 'localhost',
    port: 27017,
    database: 'zettacamp'
}

const DB_URI = `${config.protocol}://${config.hostname}:${config.port}/${config.database}`

const connect = () => {
    return mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        console.log('connected to database')
    }).catch((err) => {
        console.log('error while connecting to database', err)
    })
}

module.exports = {
    connect,
    mongoose
}