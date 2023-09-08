const { CheckType, ResponseHelper } = require('../helper/util')

const BookPurchase = (req, res) => {

    const parameterName = [
        "book",
        "taxPercentage",
        "discountPercentage",
        "bookStock",
        "bookPurchased",
        "creditDuration"
    ]

    if (Object.keys(req.body).length < 6) {
        return ResponseHelper(res, 400, "Wrong Parameter Format", {
            detail: "missing parameter(s)"
        })
    }

    for (key in req.body) {
        const isKeyExist = parameterName.filter(name => name === key)[0]
        if (!isKeyExist) {
            return ResponseHelper(res, 400, "Wrong Parameter Format", {
                detail: "wrong parameter(s) name"
            })
        }
    }

    const {
        book,
        taxPercentage,
        discountPercentage,
        bookStock,
        bookPurchased,
        creditDuration
    } = req.body

    if (!CheckType({
        book,
        taxPercentage,
        discountPercentage,
        bookStock,
        bookPurchased,
        creditDuration
    }, {
        book: "object",
        taxPercentage: "number",
        discountPercentage: "number",
        bookStock: "number",
        bookPurchased: "number",
        creditDuration: "number"
    })) return ResponseHelper(res, 400, "Wrong Parameter Format", {
        detail: "wrong parameter(s) data type"
    })

    if (!book) {
        return ResponseHelper(res, 400, "Wrong Parameter Format", {
            detail: "no book"
        })
    }

    if (Object.keys(book).length < 4) {
        return ResponseHelper(res, 400, "Wrong Parameter Format", {
            detail: "missing book properties"
        })
    }

    if (!CheckType({
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price,
        bookSale: book.on_sale
    }, {
        bookTitle: "string",
        bookAuthor: "string",
        bookPrice: "number",
        bookSale: "boolean"
    })) return ResponseHelper(res, 400, "Wrong Parameter Format", {
        detail: "wrong book properties data type"
    })

    if (taxPercentage === 0) {
        return ResponseHelper(res, 400, "Wrong Parameter Format", {
            detail: "tax percentage cannot be zero"
        })
    }

    if (book.title === '' || book.author === '') {
        return ResponseHelper(res, 400, "Wrong Parameter Format", {
            detail: "book properties cannot be empty"
        })
    }

    if (book.price === 0) {
        return ResponseHelper(res, 400, "Wrong Parameter Format", {
            detail: "book price cannot be zero"
        })
    }

    if (bookStock < bookPurchased) {
        return ResponseHelper(res, 200, "Not Enough Book Stock", {
            detail: `Sorry for the inconvenience. We don't have enough ${book.title} :(`
        })
    }

    if (bookStock === 0) {
        return ResponseHelper(res, 200, "Out of Book Stock", {
            detail: `Sorry for the inconvenience. We don't have any ${book.title} :(`
        })
    }

    if (bookPurchased === 0) {
        return ResponseHelper(res, 200, "No Purchase", {
            detail: "What are you doing?"
        })
    }

    const taxRate = taxPercentage / 100
    const taxAmount = book.price * taxRate
    const priceAfterTax = book.price + taxAmount

    const receipt = {
        book: {
            ...book,
            stock_before_purchase: bookStock,
            stock_after_purchase: bookStock
        },
        detail: {
            tax_percentage: taxPercentage,
            tax_amount: taxAmount,
            discount_percentage: 0,
            discount_amount_after_tax: 0,
            price_after_tax: priceAfterTax,
            // price_after_discount: book.price,
            price_after_discount_after_tax: priceAfterTax,
            price_total: book.price,
            credit_duration: creditDuration,
            credit_detail: [],
            item_total: 0,
            cashier: "Noer",
            customer: req.user.username
        }
    }

    if (book.on_sale) {
        const discountRate = discountPercentage / 100
        // const discountAmount = book.price * discountRate
        // const priceAfterDiscount = book.price - discountAmount

        const discountAmountAfterTax = priceAfterTax * discountRate
        const priceAfterDiscountAfterTax = priceAfterTax - discountAmountAfterTax

        receipt.detail = {
            ...receipt.detail,
            discount_percentage: discountPercentage,
            // discount_amount: discountAmount,
            discount_amount_after_tax: discountAmountAfterTax,
            // price_after_discount: priceAfterDiscount,
            price_after_discount_after_tax: priceAfterDiscountAfterTax,
            price_total: 0
        }
    }

    for (let i = 0; i < bookPurchased; i++) {
        if (receipt.book.stock_after_purchase == 0) break
        receipt.detail.price_total += receipt.detail.price_after_discount_after_tax
        receipt.book.stock_after_purchase--
        receipt.detail.item_total++
    }

    receipt.book.status = (receipt.book.stock_after_purchase > 0) ? "Book still can be purchased" : "Book cannot be purchased again"

    const dueDate = 25
    let currentYear = 2023

    const dayInMonth = [
        [31, "Jan"],
        [28, "Feb"],
        [31, "Mar"],
        [30, "Apr"],
        [31, "May"],
        [30, "Jun"],
        [31, "Jul"],
        [31, "Aug"],
        [30, "Sep"],
        [31, "Oct"],
        [30, "Nov"],
        [31, "Dec"]
    ]

    const indexOfCurrentMonth = 7
    if (creditDuration !== 0 && receipt.detail.price_total !== 0) {
        receipt.detail.credit_detail = new Array(creditDuration).fill(0).map((_, index) => {
            const currentIndexOfMonth = (indexOfCurrentMonth + 1 + index) % 12
            if (currentIndexOfMonth === 0) currentYear++

            return {
                payment_due_date: dueDate + ' ' + dayInMonth[currentIndexOfMonth][1] + ' ' + currentYear,
                payment_amount: receipt.detail.price_total / creditDuration
            }
        })
    }

    return ResponseHelper(res, 200, "Book Purchased Successfully", {
        receipt
    })
}

module.exports = BookPurchase