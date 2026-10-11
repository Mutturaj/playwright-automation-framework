console.log("Hello, Mutturaja!");

function decress<T>(arr: T[]): T[] {
    Array.isArray(arr);
    arr.sort();
    return arr.splice(0, arr.length - 1).reverse();
}

function incress<T>(arr: T[]): T[] {
    Array.isArray(arr);
    arr.sort();
    return arr.splice(1, arr.length - 1);
}
let result1 = incress<number>([12, 6, 5, 4, 3]);
console.log(decress<number>([9, 6, 5, 4, 3]));
console.log(decress<string>(["a", "b", "c", "d", "e", "mutturaja", "f"]));
console.log(result1);