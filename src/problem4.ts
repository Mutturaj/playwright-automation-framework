let arr = [1, 2, 3, 4, 5, 6, 7, 9, 10];
let target = 5;
let left = 0;
let right = arr.length - 1;

function binarySearch(arr: number[]) {
    {
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) {
                return mid;
            } else if (arr[mid] < target) {
                left++;
            } else {
                right--;
            }
        }
        return -1;
    }
}

function SearchInsert(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    let ans = arr.length;
    let insert = 8;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] >= insert) {
            ans = mid;
            right = mid - 1;

        } else {
            left = mid + 1;
        }
    }
    return ans;
}

const results = binarySearch(arr);
console.log("Target index is " + results);

const insertIndex = SearchInsert(arr, target);
console.log("insert in this index " + insertIndex);
