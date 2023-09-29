const express = require('express')
const app = express()
const port = 3000

const db = require('./db/mongo.db')
const graphql = require('./graphql/setup')

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')

const routes = require('./route/index.route')

db.connect()
graphql.init(app)

app.use(express.json())

app.use(routes)

app.use(RouteErrorHandler)
app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})