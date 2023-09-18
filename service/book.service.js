const { CheckType, ObjectFilterByProperty } = require('../helper/util')

const BookPurchase = async (req) => {

    const parameterName = [
        "book",
        "taxPercentage",
        "discountPercentage",
        "bookStock",
        "bookPurchased",
        "creditDuration",
        "termDateToPay"
    ]

    const parameterType = {
        book: "object",
        taxPercentage: "number",
        discountPercentage: "number",
        bookStock: "number",
        bookPurchased: "number",
        creditDuration: "number",
        termDateToPay: "string"
    }

    const mainParameter = ObjectFilterByProperty(req.body, parameterName)
    const isKeyNotExist = Object.keys(mainParameter).length < parameterName.length

    if (isKeyNotExist) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'missing parameter(s)'
    }]

    if (!CheckType(mainParameter, parameterType)) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'wrong parameter(s) data type'
    }]




    const {
        book,
        taxPercentage,
        discountPercentage,
        bookStock,
        bookPurchased,
        creditDuration,
        additionalTerm,
        termDateToPay
    } = req.body

    if (!book) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'no book'
    }]

    const parameterBookName = [
        "title",
        "author",
        "price",
        "on_sale",
    ]

    const parameterBookType = {
        title: "string",
        author: "string",
        price: "number",
        on_sale: "boolean"
    }

    const isBookKeyNotExist = parameterBookName.filter(name => name in book).length < parameterBookName.length

    if (isBookKeyNotExist) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'missing book properties'
    }]

    if (!CheckType(book, parameterBookType)) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'wrong book properties data type'
    }]

    if (book.title === '' || book.author === '' || book.price === 0) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'book properties cannot be zero'
    }]

    if (taxPercentage === 0) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'tax percentage cannot be zero'
    }]

    if (bookPurchased === 0) return [200, {
        message: 'No Purchase',
        detail: 'What are you doing?'
    }]

    if (bookStock < bookPurchased) return [200, {
        message: 'Not Enough Book Stock',
        detail: `Sorry for the inconvenience. We don't have enough ${book.title} :(`
    }]

    if (bookStock === 0) return [200, {
        message: 'Out of Book Stock',
        detail: `Sorry for the inconvenience. We don't have any ${book.title} :(`
    }]




    const termDate = termDateToPay.split('/')
    const isTermDateExist = termDate.length === 3

    if (!isTermDateExist) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'wrong date format. (dd/mm/yy) exist?'
    }]

    const [dayParsed, monthParsed, yearParsed] = termDate
    const isParsedMonthValid = monthParsed <= 12

    if (!isParsedMonthValid) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'wrong date format. (dd/mm/yy) month?'
    }]

    const dayInParsedMonth = new Date(yearParsed, monthParsed - 1, 0).getDate()
    const isParsedDayValid = dayParsed <= dayInParsedMonth

    if (!isParsedDayValid) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'wrong date format. (dd/mm/yy) day?'
    }]

    const termDateFormated = new Date(yearParsed, monthParsed - 1, dayParsed).toLocaleDateString('default', {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
    })




    const parameterNameAdditional = [
        "additionalTerm"
    ]

    const parameterTypeAdditional = {
        additionalTerm: "object"
    }

    const additionalParameter = ObjectFilterByProperty(req.body, parameterNameAdditional)
    const isAdditionalTermNotExist = Object.keys(additionalParameter).length < parameterNameAdditional.length

    if (!isAdditionalTermNotExist) {
        if (!CheckType(additionalParameter, parameterTypeAdditional)) return [400, {
            message: 'Wrong Parameter Format',
            detail: 'wrong additional parameter(s) data type'
        }]
    }





    if (additionalTerm) {

        const additionalTermName = [
            "term",
            "amount"
        ]

        const additionalTermType = {
            term: "number",
            amount: "number"
        }

        const isAdditionalTermKeyNotExist = additionalTermName.filter(name => name in additionalTerm).length < additionalTermName.length

        if (isAdditionalTermKeyNotExist) return [400, {
            message: 'Wrong Parameter Format',
            detail: 'missing additional term properties'
        }]

        if (!CheckType(additionalTerm, additionalTermType)) return [400, {
            message: 'Wrong Parameter Format',
            detail: 'wrong additional term properties data type'
        }]

        if (additionalTerm.term === 0) return [400, {
            message: 'Wrong Parameter Format',
            detail: 'additional term cannot be zero'
        }]

        if (additionalTerm.term > creditDuration) return [400, {
            message: 'Wrong Parameter Format',
            detail: 'additional term cannot be greater than credit duration'
        }]

        if (additionalTerm.amount < 1) return [400, {
            message: 'Wrong Parameter Format',
            detail: 'additional amount cannot be zero or less'
        }]
    }




    const taxRate = taxPercentage / 100
    const taxAmount = book.price * taxRate
    const priceAfterTax = book.price + taxAmount

    const receipt = {
        book: {
            ...book,
            stock_before_purchase: bookStock,
            stock_after_purchase: bookStock - bookPurchased,
            status: bookStock - bookPurchased > 0 ? "Book still can be purchased" : "Book cannot be purchased again"
        },
        detail: {
            date: new Date().toLocaleString('default', {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit"
            }),
            cashier: "Noer",
            customer: req.user.username,
            tax_percentage: taxPercentage,
            tax_amount: taxAmount,
            discount_percentage: 0,
            discount_amount_after_tax: 0,
            price_after_tax: priceAfterTax,
            price_after_discount_after_tax: priceAfterTax,
            price_total: bookPurchased * priceAfterTax,
            item_total: bookPurchased,
            credit_duration: creditDuration,
            credit_detail: []
        }
    }

    if (book.on_sale) {
        const discountRate = discountPercentage / 100
        const discountAmountAfterTax = priceAfterTax * discountRate
        const priceAfterDiscountAfterTax = priceAfterTax - discountAmountAfterTax

        receipt.detail = {
            ...receipt.detail,
            discount_percentage: discountPercentage,
            discount_amount_after_tax: discountAmountAfterTax,
            price_after_discount_after_tax: priceAfterDiscountAfterTax,
            price_total: bookPurchased * priceAfterDiscountAfterTax
        }
    }




    const [creditObject, creditMap] = CalculateTerm(receipt.detail.price_total, creditDuration, additionalTerm)

    console.log(creditMap)
    const termsMapParsed = Object.fromEntries(creditMap)

    const detailDate = Object.entries(creditObject)
        .filter(([_, val]) => typeof val.payment_amount === 'number')
        .map(([_, val]) => val.payment_amount)

    const termsSet = new Set(detailDate)
    const termsSetParsed = Array.from(termsSet)

    const isMapKeyExist = creditMap.has(termDateFormated)
    const termToPay = isMapKeyExist ? creditMap.get(termDateFormated) : {}

    return [200,
        {
            distinct_term: termsSetParsed,
            terms: termsMapParsed,
            terms_to_pay: termToPay
        }
    ]




    return [200, {
        message: 'Book Purchased Successfully',
        receipt
    }]
}

const CalculateTerm = (price, duration, additional) => {

    if (duration === 0) return []

    const date = new Date()

    const dateConfig = {
        dueDate: 25,
        currentYear: date.getFullYear(),
        startMonth: date.getMonth()
    }

    const creditData = new Map()

    let testRoundUp = 0
    let totalPriceNoAdditional = 0
    let totalPrice = price

    const customRoundUpResult = customRoundUp(price, duration)

    const data = new Array(duration)
        .fill(0)
        .map((_, index) => {

            const monthlyAmount = customRoundUpResult[index]
            const currentMonthIndex = (dateConfig.startMonth + 1 + index) % 12

            if (currentMonthIndex === 0) dateConfig.currentYear++

            const date = new Date(dateConfig.currentYear, currentMonthIndex, dateConfig.dueDate).toLocaleDateString('default', {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit"
            })

            let creditDetail = {
                payment_due_date: date,
                payment_amount: monthlyAmount,
                payment_date: date
            }

            if (additional?.term === index + 1) {
                const additionalAmountRounded = customRoundUpSingle(additional.amount)
                creditDetail = {
                    ...creditDetail,
                    payment_amount: monthlyAmount + additionalAmountRounded,
                    payment_additional_info: additionalAmountRounded
                }
                totalPrice += additionalAmountRounded
            }

            testRoundUp += creditDetail.payment_amount
            totalPriceNoAdditional += monthlyAmount

            return creditDetail
        })
        .filter(item => item.payment_amount !== 0)
        .map((item) => {
            const { payment_date, ...payment_info } = item
            creditData.set(payment_date, payment_info)
            return item
        })

    const finalPrice = testRoundUp != totalPrice ? testRoundUp - (testRoundUp - totalPrice) : testRoundUp

    console.log('\noriginal', price)
    console.log('rounded w/o additional', totalPriceNoAdditional)
    console.log('rounded w/ additional', finalPrice, '\n')
    // creditData.set('total_payment', price)
    // if (additional) creditData.set('total_payment_with_additional', finalPrice)



    return [data, creditData]
}

const customRoundUpSingle = (number) => {
    const n = number - number % 1
    const presition = number - n
    const result = n + (presition > 0.0 ? 1 : 0)
    console.log(number, n, presition, result)
    return result
}

const customRoundUp = (number, divider) => {

    let total = 0
    return new Array(divider).fill(0).map(() => {

        const result = customRoundUpSingle(number / divider)
        total += result
        return result

    }).map(item => {
        if (total != number) {
            total--
            return item - 1
        }
        return item
    })
}

const mongoose = require('mongoose')
const authorModel = require('../model/author.model')
const bookModel = require('../model/book.model')

const books = {}

const errorHelper = (status, err) => [status, {
    message: err.message,
    detail: err
}]

books.createOne = async (bookData) => { // OK

    const authorData = await authorModel.find({ name: bookData.author })

    const authorId = authorData.length > 0 ? authorData[0]._id : await authorModel
        .create({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data._id)

    const bookCreated = await bookModel
        .create({ ...bookData, author: authorId })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    const authorUpdated = await authorModel
        .findByIdAndUpdate(authorId, { $push: { books: bookCreated._id } })
        .catch(err => errorHelper(500, err))
        .then(data => data)

    return [200, {
        message: 'book added',
        detail: {
            authorId,
            bookCreated,
            authorUpdated
        }
    }]
}

books.readOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return errorHelper(400, { message: 'invalid ID' })
    const bookId = mongoose.Types.ObjectId(id)

    const bookRead = await bookModel
        .findById(bookId)
        .populate('author', 'name')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookRead) return [200, {
        message: 'no book fetched',
        detail: 'book not found'
    }]

    return [200, {
        message: 'book fetched',
        detail: bookRead
    }]
}

books.readAll = async () => { // OK

    const booksRead = await bookModel
        .find()
        .populate('author', 'name')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (booksRead.length === 0) return [200, {
        message: 'no book fetched',
        detail: 'empty library'
    }]

    return [200, {
        message: 'books fetched',
        detail: booksRead
    }]
}

books.updateOne = async (id, bookData) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return errorHelper({ message: 'invalid ID' })

    const authorData = await authorModel.find({ name: bookData.author })

    const authorId = authorData.length > 0 ? authorData[0]._id : await authorModel
        .create({ name: bookData.author })
        .catch(err => errorHelper(500, err))
        .then(data => data._id)

    const bookId = mongoose.Types.ObjectId(id)

    const bookUpdated = await bookModel
        .findByIdAndUpdate(bookId, { ...bookData, author: authorId })
        .populate('author', 'name')
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookUpdated) return [200, {
        message: 'no book updated',
        detail: 'book not found'
    }]

    return [200, {
        message: 'book updated',
        detail: bookUpdated
    }]
}

books.deleteOne = async (id) => { // OK

    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if (!isValidID) return errorHelper({ message: 'invalid ID' })
    const bookId = mongoose.Types.ObjectId(id)

    const bookDeleted = await bookModel
        .findByIdAndDelete(bookId)
        .catch(err => errorHelper(500, err))
        .then(data => data)

    if (!bookDeleted) return [200, {
        message: 'no book deleted',
        detail: 'book not found'
    }]

    return [200, {
        message: 'book deleted',
        detail: bookDeleted
    }]
}

books.deleteAll = async () => { // OK

    const booksDeleted = await bookModel
        .deleteMany()
        .catch(err => errorHelper(500, err))
        .then(data => data)

    const authorsDeleted = await authorModel
        .deleteMany()
        .catch(err => errorHelper(500, err))
        .then(data => data)

    return [200, {
        message: 'books and authors deleted',
        detail: {
            booksDeleted,
            authorsDeleted
        }
    }]
}

module.exports = {
    BookPurchase,
    BookService: books
}