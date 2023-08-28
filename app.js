// # task 1
// update book purchasing function
// add parameter for the total duration of credit
// (indication the credit term length in months)
// and calculate the due date for each month
// starting from the next month when you work on this code
// using array function in javascript
// and display the result as an array of strings

const PurchaseBook = (book, taxPercentage, discountPercentage, bookStock, bookPurchased, creditDuration = 1) => {
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

    ((receipt, creditDuration) => {

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
        const tempArray = new Array(creditDuration).fill(0)

        const monthOfCredit = tempArray.map((_, index) => {
            const currentIndexofMonth = (indexOfCurrentMonth + 1 + index) % 12
            if (currentIndexofMonth === 0) currentYear++
            return [
                ...dayInMonth[currentIndexofMonth],
                currentYear
            ]
        }).map(val => {
            return dueDate + ' ' + val[1] + ' ' + val[2]
        })

        const creditPerMonth = receipt.detail.price_total / creditDuration

        receipt.detail = {
            ...receipt.detail,
            credit_duration: creditDuration,
            credit_due_month: monthOfCredit,
            credit_per_month: creditPerMonth
        }

    })(receipt, creditDuration);

    ((receipt) => {
        const displayBookPrice = "Rp" + receipt.book.price

        const displayDiscountPercentage = receipt.detail.discount_percentage + "%"
        const displayDiscountAmmount = "Rp" + receipt.detail.discount_amount
        const displayPriceAfterDiscount = "Rp" + receipt.detail.price_after_discount
        const displayTaxPercentage = receipt.detail.tax_percentage + "%"
        const displayTaxAmmount = "Rp" + receipt.detail.tax_amount
        const displayPriceAfterTax = "Rp" + receipt.detail.price_after_tax
        const displayDiscountAmmountAfterTax = "Rp" + receipt.detail.discount_amount_after_tax
        const displayPriceAfterDiscountAfterTax = "Rp" + receipt.detail.price_after_discount_after_tax

        const displayPriceTotal = "Rp" + receipt.detail.price_total

        const displayStock = (receipt.book.stock == 0 ? "Unavailable" : "Available") + " for another purchase"

        const display =
            `====================\n` +
            `${receipt.book.title}\nby ${receipt.book.author}\n` +
            `====================\n` +
            `Price: ${displayBookPrice}\n` +
            `Status: ${displayStock}\n` +
            `Stock: ${receipt.book.stock_after_purchase}/${receipt.book.stock_before_purchase}\n` +
            `--------------------\n` +
            `Tax%: ${displayTaxPercentage}\n` +
            `Tax: ${displayTaxAmmount}\n` +
            `Price after Tax: ${displayPriceAfterTax}\n` +
            `--------------------\n` +
            `Discount%: ${displayDiscountPercentage}\n` +
            `Discount: ${displayDiscountAmmount} (w/o Tax)\n` +
            `Price after Discount: ${displayPriceAfterDiscount} (w/o Tax)\n` +
            `Discount: ${displayDiscountAmmountAfterTax} (w/ Tax)\n` +
            `Price after Discount: ${displayPriceAfterDiscountAfterTax} (w/ Tax)\n` +
            `--------------------\n` +
            `Total item: ${receipt.detail.item_total}\n` +
            `Total price: ${displayPriceTotal}\n` +
            `--------------------\n` +
            `Cashier: ${receipt.detail.cashier}\n` +
            `====================\n` +
            `Credit duration: ${receipt.detail.credit_duration} month(s)\n\n` +
            `Payment due: \n${receipt.detail.credit_due_month.map(val => val + '\t: Rp' + receipt.detail.credit_per_month).join(`\n`)}\n` +
            `====================\n`

        // console.log(display)
        // console.log(receipt)
    })(receipt);

    console.log(receipt.detail.credit_due_month)
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
PurchaseBook(book, taxPercentage, discountPercentage, 20, 10, 5)

const isCart = false

if (isCart) {
    const cart = []
    cart.push(book)
    cart.push(new Book("The Stranger", "Albert Camus", 80000, true, 12))
    cart.push(new Book("Rumah Kertas", "Carlos María Domínguez", 45000, false, 5))
    cart.push(new Book("Pemburu Akasara", "Ana María Shua", 44000, true, 10))
    cart.push(new Book("Hidup di Luar Tempurung", "Benedict Anderson", 54000, true, 20))
    console.log('cart', cart, '\n')

    const shiftedBook = cart.shift()
    console.log('shifted book', shiftedBook)
    console.log('shifted cart', cart, '\n')

    cart.unshift(new Book("Setelah Boombox Usai Menyalak", "Herry Sutresna", 75000))
    console.log('unshifted cart', cart, '\n')

    const poppedBook = cart.pop()
    console.log('popped book', poppedBook)
    console.log('popped cart', cart, '\n')

    cart
        .filter(item => item.price < 60000)
        .map(item => item.title + ' by ' + item.author)
        .forEach((item, index) => {
            console.log((index + 1), item)
        })

    const cartPrice = cart
        .map(item => item.price)
        .reduce((total, current) => total + current, 0)
    console.log('\ncart price', cartPrice, '\n')

    cart.map((item, index) => {
        const item_receipt = PurchaseBook(item,taxPercentage,discountPercentage, 10, 10, index + 5)
        return [
            item.title,
            item.price,
            item_receipt.detail.credit_duration,
            item_receipt.detail.credit_due_month
        ]
    }).forEach(item => {
        console.log(item[0], item[1], item[2], item[3])
    })
}