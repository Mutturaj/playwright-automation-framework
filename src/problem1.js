console.log("Hello, World!");
function decres(arr) {
    Array.isArray(arr);
    arr.sort();
    return arr.splice(0, arr.length - 1).reverse();
}
console.log(decres([1, 2, 5, 4, 3]));
console.log(decres(["a", "b", "c", "d", "e"]));
