const mongoose = require('mongoose')

const config = {
    protocol: 'mongodb',
    hostname: 'localhost',
    port: 27017,
    database: 'zettacamp'
}

const dbUri = `${config.protocol}://${config.hostname}:${config.port}/${config.database}`

const Connect = () => {
    return mongoose.connect(dbUri, {
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
    Connect,
    mongoose
}