console.log("Hello, Mutturaja!");
function decress(arr) {
    Array.isArray(arr);
    arr.sort();
    return arr.splice(0, arr.length - 1).reverse();
}
function incress(arr) {
    Array.isArray(arr);
    arr.sort();
    return arr.splice(1, arr.length - 1);
}
var result1 = incress([12, 6, 5, 4, 3]);
console.log(decress([9, 6, 5, 4, 3]));
console.log(decress(["a", "b", "c", "d", "e", "mutturaja", "f"]));
console.log(result1);
