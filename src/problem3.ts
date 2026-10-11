let num1 = [1, 2, 3, 4, 7, 8, 10];
let num2 = [5, 6, 9];



function mergeArrays<T>(arr1: number[], arr2: number[]) {
    let i = 0;
    let j = 0;
    let result: number[] = [];
    while (i < arr1.length - 1 && j < arr2.length - 1) {
        if (arr1[i] == arr2[j]) {
            arr1.push(arr1[i]);
            i++;
            j++;
        } else if (arr1[i] < arr2[j]) {
            result.push(arr1[j]);
            i++;
        } else {
            result.push(arr2[j]);
            j++;
        }
    }
    return result;
}
const result = mergeArrays(num1, num2);
console.log(result);