"use strict";
let num = [5, 8, 2, 20, 9, 14, 11, 18, 3, 6];
let L = 0;
let R = num.length - 1;
function mergeSort(num, L, R) {
    if (num.length <= 1) {
        return num;
    }
    if (L < R) {
        let mid = Math.floor((L + R) / 2);
        mergeSort(num, L, mid);
        mergeSort(num, mid + 1, R);
        merge(num, L, mid, R);
    }
    return num;
}
function merge(num, L, mid, R) {
    let leftArr = num.slice(L, mid + 1);
    let rightArr = num.slice(mid + 1, R + 1);
    let i = L;
    let j = mid + 1;
    let k = L;
    while (i <= mid && j <= R) {
        if (leftArr[i - L] <= rightArr[j - mid - 1]) {
            num[k++] = leftArr[i - L];
            i++;
        }
        else {
            num[k++] = rightArr[j - mid - 1];
            j++;
        }
    }
    if (i > mid) {
        while (j <= R) {
            num[k++] = rightArr[j - mid - 1];
            j++;
        }
    }
    else {
        while (i <= mid) {
            num[k++] = leftArr[i - L];
            i++;
        }
    }
}
let sortedArray = mergeSort(num, L, R);
console.log("Sorted array is " + sortedArray);
//# sourceMappingURL=problem5.js.map