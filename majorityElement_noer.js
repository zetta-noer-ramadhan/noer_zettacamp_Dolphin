/**
 * write a function that returns the majority element.
 * The majority element is the element that appears more than other element.
 * READ EXAMPLE BELOW!

console.log(majorityElement([3, 2, 3])); // Output: 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2

 * You may assume that the majority element always exists in the array.

 * Returns the majority element from the input array of integers.

 * @param {number[]} nums - The input array of integers.
 * @return {number} Returns the majority element.
 */
function majorityElement(nums) {

    const temp = {}

    nums.forEach(item => {
        temp[item] ||= 0
        temp[item]++
    })

    console.log(temp)

    const maxFreq = Object
        .entries(temp)
        .reduce((prev, curr) => prev[1] >= curr[1] ? prev : curr)[1]

    // console.log(temp, maxFreq)

    const result = Object
        .entries(temp)
        .filter(item => item[1] == maxFreq)
        .map(item => [item[0], nums.findIndex(num => num == item[0])])
        .reduce((prev, curr) => prev[1] <= curr[1] ? prev : curr)[0]

    // console.log(+result)

    return +result
}

console.log(majorityElement([2, 3, 2, 3])); // Output: 2
console.log(majorityElement([3, 2, 2, 3])); // Output: 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2
console.log(majorityElement([1, 2, 3, 3, 2, 1, 5, 4])); // Output: 1
