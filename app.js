const express = require('express')
const app = express()
const port = 3000

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')
const BookPurchaseRoute = require('./route/book.route')

app.use(express.json())

app.use(BookPurchaseRoute)
app.use(RouteErrorHandler)
app.use(ErrorHandler)

app.listen(port, () => {
    console.log(`listenting on ${port}`)
})