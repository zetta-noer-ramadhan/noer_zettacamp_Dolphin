const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')

const BookRoute = require('./route/book.route')

const config = {
    protocol: 'mongodb',
    hostname: 'localhost',
    port: 27017,
    database: 'zettacamp'
}

const DB_URI = `${config.protocol}://${config.hostname}:${config.port}/${config.database}`

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('connected to database')
}).catch((err) => {
    console.log('error while connecting to database', err)
})

app.use(express.json())

app.use(BookRoute)

app.use(RouteErrorHandler)
app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})