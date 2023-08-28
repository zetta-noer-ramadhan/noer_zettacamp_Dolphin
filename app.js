// # task 1
// update your book purchashing function to have
// parameter amount of stock and amout of purchased book
// then calculate total price & display the result

// note: the function must have at least
// - for loop iteration
// - break when amount of book is already out of stock
// - display text if amount of book after purchashing
//   can be purchased again or not

const PurchaseBook = (book, taxPercentage = 0, discountPercentage = 0, purchasedAmount = 1) => {
    if (!book) {
        console.log('Book? What is Book?')
        return null
    }
    if(book.stock < purchasedAmount) {
        console.log(`Sorry for the inconvenience.\nWe don't have enough ${book.title} :(`)
        return {
            msg: "Out of Stock",
            book
        }
    }
    if (book.stock == 0) {
        console.log(`Sorry for the inconvenience.\nWe don't have enough ${book.title} :(`)
        return {
            msg: "Out of Stock",
            book
        }
    }

    const receipt = {
        book,
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
    const MASTER_STOCK = book.stock
    for (let i = 0; i < purchasedAmount; i++) {
        if (receipt.book.stock == 0) break
        receipt.detail.price_total += receipt.detail.price_after_discount_after_tax
        receipt.book.stock--
        receipt.detail.item_total++
    }


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
            `Stock: ${receipt.book.stock}/${MASTER_STOCK}\n` +
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
            `====================\n`

        // console.log(display)
    })(receipt)

    return receipt
}

const Book = function (title, author, price, onSale = false, stock = 1) {
    this.title = title
    this.author = author
    this.price = price
    this.on_sale = onSale
    this.stock = stock
}

const taxPercentage = 5
const discountPercentage = 25

const book = new Book("Bakat Menggonggong", "Dea Anugrah", 75000, true, 0)

PurchaseBook(book, taxPercentage, discountPercentage, 0)

const isCart = true

if (isCart) {
    const cart = []
    cart.push(book)
    cart.push(new Book("The Stranger", "Albert Camus", 80000, true, 12))
    cart.push(new Book("Rumah Kertas", "Carlos María Domínguez", 45000, false, 5))
    cart.push(new Book("Pemburu Akasara", "Ana María Shua", 44000, true, 10))
    cart.push(new Book("Hidup di Luar Tempurung", "Benedict Anderson", 54000, true, 20))

    let itemCount = 0
    let itemPriceTotal = 0
    cart.forEach(key => {
        const data = PurchaseBook(key, taxPercentage, discountPercentage, 10)
        if (data.msg) {
            console.log(data.book.title, 'is', data.msg)
        } else {
            itemCount += data.detail.item_total
            itemPriceTotal += data.detail.price_total
        }
    })

    console.log(`You buy ${itemCount} books for Rp${itemPriceTotal}`)
}
