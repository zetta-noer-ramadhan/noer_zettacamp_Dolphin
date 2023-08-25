/**
 *
 * Write a Node.js function isPrime(n) that takes an integer n as an argument and returns true if n is a prime number and false otherwise.
 *
 */
function isPrime(n) {
    if (n <= 1) return false
    if (n == 2) return true
    if (n % 2 == 0) return false
    for (let i = 2; i < n; i++) {
        if (n % i == 0) return false
    }
    return true
}

// console.log(isPrime(10))
console.log(isPrime(45))

// let arr = []
// for (let i = 1; i < 200; i++) {
//     if (isPrime(i)) arr.push(i)
// }
// console.log(arr)