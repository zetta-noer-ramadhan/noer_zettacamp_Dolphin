const { CheckType, ResponseHelper } = require('../helper/util')

const BookPurchase = async (req, res) => {

    const parameterName = [
        "book",
        "taxPercentage",
        "discountPercentage",
        "bookStock",
        "bookPurchased",
        "creditDuration"
    ]

    const parameterNameAdditional = [
        "additionalTerm"
    ]

    const parameterType = {
        book: "object",
        taxPercentage: "number",
        discountPercentage: "number",
        bookStock: "number",
        bookPurchased: "number",
        creditDuration: "number"
    }

    const parameterTypeAdditional = {
        additionalTerm: "object"
    }

    const isKeyNotExist = parameterName.filter(name => Object.keys(req.body).includes(name)).length < parameterName.length

    if (isKeyNotExist) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'missing parameter(s)'
        }]
    }


    const filterAdditionalParameter = Object.entries(req.body).filter(([key, _]) => !parameterNameAdditional.includes(key))
    const mainParameter = Object.fromEntries(filterAdditionalParameter)
    const additionalParameter = Object.fromEntries(Object.entries(req.body).filter(([key, _]) => parameterNameAdditional.includes(key)))

    if (!CheckType(mainParameter, parameterType)) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'wrong parameter(s) data type'
        }]
    }

    const isAdditionalTermNotExist = parameterNameAdditional.filter(name => Object.keys(req.body).includes(name)).length < parameterNameAdditional.length

    if (!isAdditionalTermNotExist) {
        if (!CheckType(additionalParameter, parameterTypeAdditional)) {
            return [400, {
                message: 'Wrong Parameter Format',
                detail: 'wrong additional parameter(s) data type'
            }]
        }
    }



    const {
        book,
        taxPercentage,
        discountPercentage,
        bookStock,
        bookPurchased,
        creditDuration,
        additionalTerm
    } = req.body

    if (!book) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'no book'
        }]
    }


    const additionalTermName = [
        "term",
        "amount"
    ]

    const additionalTermType = {
        term: "number",
        amount: "number"
    }

    if (additionalTerm) {
        const isAdditionalTermKeyNotExist = additionalTermName.filter(name => Object.keys(additionalTerm).includes(name)).length < additionalTermName.length

        if (isAdditionalTermKeyNotExist) {
            return [400, {
                message: 'Wrong Parameter Format',
                detail: 'missing additional term properties'
            }]
        }

        if (!CheckType(additionalTerm, additionalTermType)) {
            return [400, {
                message: 'Wrong Parameter Format',
                detail: 'wrong additional term properties data type'
            }]
        }

        if(additionalTerm.term === 0){
            return [400, {
                message: 'Wrong Parameter Format',
                detail: 'additional term cannot be zero'
            }]
        }
        if(additionalTerm.term > creditDuration){
            return [400, {
                message: 'Wrong Parameter Format',
                detail: 'additional term cannot be greater than credit duration'
            }]
        }

    }




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

    const isBookKeyNotExist = parameterBookName.filter(name => Object.keys(book).includes(name)).length < parameterBookName.length

    if (isBookKeyNotExist) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'missing book properties'
        }]
    }

    if (!CheckType(book, parameterBookType)) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'wrong book properties data type'
        }]
    }




    if (book.title === '' || book.author === '' || book.price === 0) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'book properties cannot be zero'
        }]
    }

    if (taxPercentage === 0) {
        return [400, {
            message: 'Wrong Parameter Format',
            detail: 'tax percentage cannot be zero'
        }]
    }

    if (bookPurchased === 0) {
        return [200, {
            message: 'No Purchase',
            detail: 'What are you doing?'
        }]
    }




    if (bookStock < bookPurchased) {
        return [200, {
            message: 'Not Enough Book Stock',
            detail: `Sorry for the inconvenience. We don't have enough ${book.title} :(`
        }]
    }

    if (bookStock === 0) {
        return [200, {
            message: 'Out of Book Stock',
            detail: `Sorry for the inconvenience. We don't have any ${book.title} :(`
        }]
    }



    const date = new Date()
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
            date: date.toLocaleString('default', { day: '2-digit', month: 'short', year: 'numeric' }),
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

    receipt.detail.credit_detail = await CalculateTerm(receipt.detail.price_total, creditDuration, additionalTerm)

    return [200, {
        message: 'Book Purchased Successfully',
        receipt
    }]
}

const CalculateTerm = async (price, duration, additional) => {

    if (duration === 0) return []

    const date = new Date()
    const dueDate = 25
    let currentYear = date.getFullYear()
    const indexOfCurrentMonth = date.getMonth()

    return new Array(duration).fill(0).map((_, index) => {
        const currentIndexOfMonth = (indexOfCurrentMonth + 1 + index) % 12
        if (currentIndexOfMonth === 0) currentYear++

        const currentMonth = new Date(currentYear, currentIndexOfMonth, dueDate).toLocaleString('default', { month: 'short' })

        const monthlyAmount = price / duration

        let creditDetail = {
            payment_due_date: [dueDate, currentMonth, currentYear,].join(' '),
            payment_amount: monthlyAmount,
        }

        if (additional?.term === index + 1) {
            creditDetail = {
                ...creditDetail,
                payment_amount: monthlyAmount + additional.amount,
                payment_additional: additional.amount
            }
        }

        return creditDetail
    })
}

module.exports = {
    BookPurchase,
    CalculateTerm
}