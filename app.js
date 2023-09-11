const express = require('express')
const app = express()
const port = 3000

const { ErrorHandler, RouteErrorHandler } = require('./helper/util')
const BookPurchaseRoute = require('./route/book.route')

app.use(express.json())

app.use(ErrorHandler)

app.use(BookPurchaseRoute)

app.get('/', (req, res) => res.status(200).send('hello world!'))

app.use(RouteErrorHandler)

app.listen(port, () => {
    console.log(`listenting on ${port}`)
})