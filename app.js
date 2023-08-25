let book1 = "Rumah Kertas"
const book2 = "Rumah Kertas"

book1 = "As I Lay Dying"
// book2 = "Another Book" // throws a TypeError

let result = book1.concat(', ', book2)
console.log(result)




let number1 = 2023
const flag = true

number1 *= 20
// flag = !flag // throws a TypeError

result = number1 + flag
console.log(result)




let number2 = 20.5
const text = "lorem ipsum"

number2 = 20.5 ** 2
// text = "dolor sit amet" // throws a TypeError

result = number2 + ' ' + text
console.log(result)




let teks = "another lorem"
const arr3 = [90, 123]

teks = "another ipsum"
arr3.push(12)

result = teks.concat(',', arr3)
console.log(result)




let number3 = 903
const arr4 = [21, 238, 435]

number3 *= 4
arr4.pop()

result = [number3, ...arr4]
console.log(result)




let arr = [1, 2, 3]
const obj = { name: "John Doe" }

arr = arr.concat([4, 7, 3])
obj.age = 20

result = arr.concat(obj)
console.log(result)




let obj2 = { title: "Bakat Menggonggong" }
const arr2 = [5, 2]

obj2.author = "Dea Anugrah"
arr2.push(19)

result = { ...obj2, arr2 }
console.log(result)




// let sample1 = [1, 2, 3]
// let sample2 = { id: 0 }
// console.log(typeof sample1, typeof sample2)
// immutable vs mutable