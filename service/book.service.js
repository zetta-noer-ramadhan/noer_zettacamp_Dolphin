const { CheckType, ObjectFilterByProperty } = require('../helper/util')

const BookPurchase = async (req) => {

    const parameterName = [
        "book",
        "taxPercentage",
        "discountPercentage",
        "bookStock",
        "bookPurchased",
        "creditDuration"
    ]

    const parameterType = {
        book: "object",
        taxPercentage: "number",
        discountPercentage: "number",
        bookStock: "number",
        bookPurchased: "number",
        creditDuration: "number"
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
        additionalTerm
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



    const parameterNameAdditional = [
        "additionalTerm"
    ]

    const parameterTypeAdditional = {
        additionalTerm: "object"
    }

    const additionalParameter = ObjectFilterByProperty(req.body, parameterNameAdditional)
    const isAdditionalTermNotExist = Object.keys(additionalParameter).length < parameterNameAdditional.length

    if (!isAdditionalTermNotExist && !CheckType(additionalParameter, parameterTypeAdditional)) return [400, {
        message: 'Wrong Parameter Format',
        detail: 'wrong additional parameter(s) data type'
    }]




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
            date: new Date().toLocaleString('default', { day: '2-digit', month: 'short', year: 'numeric' }),
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

    const dateConfig = {
        dueDate: 25,
        currentYear: date.getFullYear(),
        currentMonth: date.getMonth(),
        startMonth: date.getMonth()
    }

    return new Array(duration).fill(0).map((_, index) => {

        const monthlyAmount = price / duration
        const currentMonthIndex = (dateConfig.startMonth + 1 + index) % 12

        if (currentMonthIndex === 0) dateConfig.currentYear++

        dateConfig.currentMonth = new Date(dateConfig.currentYear, currentMonthIndex, dateConfig.dueDate).toLocaleString('default', { month: 'short' })

        let creditDetail = {
            payment_due_date: [dateConfig.dueDate, dateConfig.currentMonth, dateConfig.currentYear].join(' '),
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