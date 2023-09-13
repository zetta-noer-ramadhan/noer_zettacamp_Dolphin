const express = require('express')
const app = express()
const port = 3000

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')
const BookPurchaseRoute = require('./route/book.route')
const AsyncFunctionRoute = require('./route/async.route')

app.use(express.json())

app.use(BookPurchaseRoute)
app.use(AsyncFunctionRoute)
app.use(RouteErrorHandler)
app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})