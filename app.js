const express = require('express')
const app = express()
const port = 3000

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')

const routes = require('./route/index.route')
const db = require('./db/mongo.db')

db.connect()

app.use(express.json())

app.use(routes)

app.use(ErrorHandler)
app.use(RouteErrorHandler)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})