"use strict";
let arr1 = [5, 0, 2, 0, 9, 14, 0, 18, 0, 6];
function moveZeroes(arr1) {
    let nonZeroIndex = 0;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== 0) {
            arr1[nonZeroIndex] = arr1[i];
            nonZeroIndex++;
        }
    }
    for (let i = nonZeroIndex; i < arr1.length; i++) {
        arr1[i] = 0;
    }
    return arr1;
}
let result2 = moveZeroes(arr1);
console.log("Array after moving zeroes: " + result2);
//# sourceMappingURL=problem6.js.map