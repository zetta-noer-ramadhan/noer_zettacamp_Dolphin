// # task 1 a
// use comparison operator with 2 variables from task number 1
// display true if the name of books have same name
// otherwise display false
console.log('# task 1 a')

let bookOne = "Rumah Kertas"
const bookTwo = "As I Lay Dying"

console.log('Book One:', bookOne, '| Book Two:', bookTwo)

if (bookOne == bookTwo) {
    console.log('same name? true')
} else {
    console.log('same name? false')
}

console.log('same name?', bookOne == bookTwo ? true : false)


// # task 2 a
// compare two price of books
// to find which one have the highest price
console.log('\n# task 2 a')

const bookOnePrice = 750000
const bookTwoPrice = 450000


let bookMaxPriceIfElse = 0
if (bookOnePrice > bookTwoPrice) {
    bookMaxPriceIfElse = "Book 1, " + bookOnePrice
} else if (bookOnePrice < bookTwoPrice) {
    bookMaxPriceIfElse = "Book 2, " + bookTwoPrice
} else {
    bookMaxPriceIfElse = "Same price"
}
console.log('Book with the highest price:', bookMaxPriceIfElse)

const bookMaxPriceTernary = bookOnePrice == bookTwoPrice ? "Same price" : (bookOnePrice > bookTwoPrice ? "Book 1, " + bookOnePrice : "Book 2, " + bookTwoPrice )
console.log('Book with the highest price:', bookMaxPriceTernary)


// # task 2 b
// find the average price of books
// using arithmetic operator
console.log('\n# task 2 b')

const bookPriceAverage = (bookOnePrice + bookTwoPrice) / 2
console.log("Book price average:", bookPriceAverage)



// # task 2 c
// create new variable to use ternary operator
// to determine the value of variable
// if the average price more than 500000
// set value with string "Expensive"
// if less or equal set "Cheap"
console.log('\n# task 2 c')

const valueOfBook = bookPriceAverage < 500000 ? "Expensive" : "Cheap"
console.log('Value of book based on average price:', valueOfBook)


// # logic test
// write a function max_of_two(a, b) that takes in two integers,
// a and b, and return the maximum of the two numbers
// without using any arrays or built-in function
console.log('\n# logic test')

function max_of_two(a, b) {
    return a >= b ? a : b
}
console.log(max_of_two(10, 5))
console.log(max_of_two(-1, 10))


function maxOfTwoBit(a, b) {
    const sum = a + b
    const difference = a - b
    const isPositive = difference & (1 << 31) && 1
    // return sum - (b + (isPositive * difference))
    return sum - (a * isPositive) - (b * !isPositive)
}
console.log(maxOfTwoBit(10, 5))
console.log(maxOfTwoBit(45, 66))

// # etc
const books = []

const newBook = {
    name: "Bakat Menggonggong",
    author: "Dea Anugrah",
    price: 75000,
}

newBook.on_sale = true
newBook['description'] = "Lorem ipsum dolor sit amet"

const discountRate = 0.4

books.push(newBook)

const priceAfterDiscount = books[0].on_sale ? (books[0].price - (books[0].price * discountRate)) : books[0].price

books[0] = {
    ...books[0],
    price_after_discount: priceAfterDiscount
}

console.log('\n# etc')
console.log('New Book to be added to catalog', newBook)
console.log('Current catalog', books)
console.log('Current discount rate', discountRate)
console.log('First book on catalog price', books[0].price)
console.log('First book on catalog price after discount', books[0].price_after_discount)