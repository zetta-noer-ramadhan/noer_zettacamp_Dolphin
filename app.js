const express = require('express')
const app = express()
const port = 3000

const db = require('./db/mongo.db')
const graphql = require('./graphql/setup')

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')

db.connect()
graphql.init(app)

app.use(RouteErrorHandler)
app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})