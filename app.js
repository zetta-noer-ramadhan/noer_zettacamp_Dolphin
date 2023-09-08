const express = require('express')
const app = express()
const port = 3000

const { ResponseHelper } = require('./helper/util')
const CheckAuthenticationMiddleware = require('./middleware/checkAuthentication')
const BookPurchaseRoute = require('./route/bookPurchase')

app.use(express.json())

app.use((err, req, res, next) => {
    return ResponseHelper(res, err.statusCode, err.type, {
        detail: err.message
    })
})

app.post('/bookPurchase', CheckAuthenticationMiddleware, BookPurchaseRoute)

// app.get('/:title/:author', (req, res) => {
//     return ResponseHelper(res, 200, "testing route", {
//         params: req.params
//     })
// })

// app.get('/:sample', (req, res) => {
//     return ResponseHelper(res, 200, "testing another route", {
//         params: req.params
//     })
// })

app.get('/', (req, res) => {
    return ResponseHelper(res, 200, "Hello World!")
})

app.use((req, res, next) => {
    return ResponseHelper(res, 404, 'Not Found', {
        detail: req.path + ' not found'
    })
})

app.listen(port, () => {
    console.log(`listenting on ${port}`)
})