console.log("Hello, World!");
function decres<T>(arr: T[]): T[] {
    Array.isArray(arr);
    arr.sort();
    return arr.splice(0, arr.length - 1).reverse();
}
console.log(decres<number>([1, 2, 5, 4, 3]));
console.log(decres<string>(["a", "b", "c", "d", "e"]));
