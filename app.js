// # task 1
// try create a book purchasing function that has parameters
// detail of book, percentage of the discount, percentage of tax
// then display all the parameters with additional data
// - ammount of discount
// - price after discount
// - amount of tax
// - price after tax

// note: function must have at least
// - const
// - Boolean, Number, String
// - =, +, -, *, /

function PurchaseBook(book, discountPercentage = 0, taxPercentage = 0) {
    if (!book) {
        console.log('something is missing when you purcashing')
        return {}
    }

    const isBookOnSale = book.on_sale

    const receipt = {
        book,
        detail: {
            discount_percentage: 0,
            discount_ammount: 0,
            price_after_discount: book.price,
            tax_percentage: 0,
            tax_ammount: 0,
            price_after_tax: book.price,
            discount_ammount_after_tax: 0,
            price_after_discount_after_tax: book.price,
            cashier: "Noer"
        }
    }

    if (isBookOnSale) {
        const discountRate = discountPercentage / 100
        const taxRate = taxPercentage / 100

        const discountAmmount = discountRate * book.price
        const priceAfterDiscount = book.price - discountAmmount

        const taxAmmount = taxRate * book.price
        const priceAfterTax = book.price + taxAmmount

        const discountAmmountAfterTax = discountRate * priceAfterTax
        const priceAfterDiscountAfterTax = priceAfterTax - discountAmmountAfterTax

        receipt.detail = {
            ...receipt.detail,
            discount_percentage: discountPercentage,
            discount_ammount: discountAmmount,
            price_after_discount: priceAfterDiscount,
            tax_percentage: taxPercentage,
            tax_ammount: taxAmmount,
            price_after_tax: priceAfterTax,
            discount_ammount_after_tax: discountAmmountAfterTax,
            price_after_discount_after_tax: priceAfterDiscountAfterTax
        }
    }
    return receipt
}

const Print = (receipt) => {

    const displayBookPrice = "Rp" + receipt.book.price

    const displayDiscountPercentage = receipt.detail.discount_percentage + "%"
    const displayDiscountAmmount = "Rp" + receipt.detail.discount_ammount
    const displayPriceAfterDiscount = "Rp" + receipt.detail.price_after_discount

    const displayTaxPercentage = receipt.detail.tax_percentage + "%"
    const displayTaxAmmount = "Rp" + receipt.detail.tax_ammount
    const displayPriceAfterTax = "Rp" + receipt.detail.price_after_tax

    const displayDiscountAmmountAfterTax = "Rp" + receipt.detail.discount_ammount_after_tax
    const displayPriceAfterDiscountAfterTax = "Rp" + receipt.detail.price_after_discount_after_tax

    const display =
        `====================\n` +
        `${receipt.book.Title()}\nby ${receipt.book.Author()}\n` +
        `====================\n` +
        `Price: ${displayBookPrice}\n` +
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
        `Cashier: ${receipt.detail.cashier}\n` +
        `====================`

    console.log(display)
}

const Book = function (titles, authors, prices, sales) {
    this.title = titles
    this.author = authors
    this.price = prices
    this.on_sale = sales
    this.Title = () => this.title
    this.Author = function GetAuthor() { return this.author }
}

const newBook = new Book("Bakat Menggonggong", "Dea Anugrah", 75000, false)

const discountPercentage = 45
const taxPercentage = 6

const receipt = PurchaseBook(newBook, discountPercentage, taxPercentage)
Print(receipt)



const sample = {
    title: "halo",
    GetTitle: () => {
        return this.title
    },
    GetTitleAnother: function () {
        return this.title
    },
}
// console.log(sample.GetTitle())
// console.log(sample.GetTitleAnother())
// console.log(newBook.Another())