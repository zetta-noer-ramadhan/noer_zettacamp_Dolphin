// # task 1
// update function to calculate amount of payment each month
// using array function
// display data as an array of object
// that have values due date of payment and amount of payment
// total amount of payment musbe be the same as total price

const PurchaseBook = (book, taxPercentage, discountPercentage, bookStock, bookPurchased, creditDuration = 0) => {

    if (!book) {
        console.log('Book? What is book?')
        return null
    }

    if (bookStock < bookPurchased) {
        console.log(`Sorry for the inconvenience.\nWe don't have enough ${book.title} :(`)
        return {
            msg: "Not Enough Stock",
            book
        }
    }

    if (bookStock === 0) {
        console.log(`Sorry for the inconvenience.\nWe don't have enough ${book.title} :(`)
        return {
            msg: "Out of Stock",
            book
        }
    }

    const receipt = {
        book: {
            ...book,
            stock_before_purchase: bookStock,
            stock_after_purchase: bookStock
        },
        detail: {
            tax_percentage: 0,
            tax_amount: 0,
            discount_percentage: 0,
            discount_amount: 0,
            price_after_tax: book.price,
            price_after_discount: book.price,
            price_after_discount_after_tax: book.price,
            price_total: book.price,
            item_total: 0,
            credit_duration: creditDuration,
            credit_detail: [],
            cashier: "Noer"
        }
    }

    if (book.on_sale) {
        const taxRate = taxPercentage / 100
        const taxAmount = book.price * taxRate
        const priceAfterTax = book.price + taxAmount
        const discountRate = discountPercentage / 100
        const discountAmount = book.price * discountRate
        const discountAmountAfterTax = priceAfterTax * discountRate
        const priceAfterDiscount = book.price - discountAmount
        const priceAfterDiscountAfterTax = priceAfterTax - discountAmountAfterTax

        receipt.detail = {
            ...receipt.detail,
            tax_percentage: taxPercentage,
            tax_amount: taxAmount,
            discount_percentage: discountPercentage,
            discount_amount: discountAmount,
            discount_amount_after_tax: discountAmountAfterTax,
            price_after_tax: priceAfterTax,
            price_after_discount: priceAfterDiscount,
            price_after_discount_after_tax: priceAfterDiscountAfterTax,
        }
    }

    for (let i = 0; i < bookPurchased; i++) {
        if (receipt.book.stock_after_purchase == 0) break
        receipt.detail.price_total += receipt.detail.price_after_discount_after_tax
        receipt.book.stock_after_purchase--
        receipt.detail.item_total++
    }

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

    receipt.detail.credit_detail = new Array(creditDuration).fill(0).map((_, index) => {
        const currentIndexOfMonth = (indexOfCurrentMonth + 1 + index) % 12
        if (currentIndexOfMonth === 0) currentYear++

        return {
            payment_due_date: dueDate + ' ' + dayInMonth[currentIndexOfMonth][1] + ' ' + currentYear,
            payment_amount: receipt.detail.price_total / creditDuration
        }
    })

    const { detail: { credit_detail, price_total } } = receipt

    // these lines are used to see whether
    // the amount of credit payment equal to amout of price total
    // const credit_total = credit_detail.reduce((total, current) => total + current.payment_amount, 0)

    console.log(credit_detail)
    // console.log({
    //     credit_detail: credit_detail,
    //     credit_total: credit_total,
    //     price_total: price_total
    // })

    return receipt
}

const Book = function (title, author, price, onSale = false) {
    this.title = title
    this.author = author
    this.price = price
    this.on_sale = onSale
}

const taxPercentage = 5
const discountPercentage = 25

const book = new Book("Bakat Menggonggong", "Dea Anugrah", 75000, true)
PurchaseBook(book, taxPercentage, discountPercentage, 20, 10, 10)