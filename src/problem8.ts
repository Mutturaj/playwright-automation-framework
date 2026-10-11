
function reverse(arr: number[], start: number, end: number): void {
    while (start < end) {
        let temp = arr[start];      
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }   
}
function right_roteate(arr: number[], k: number): number[] {    
    let n = arr.length;
    console.log("Original array Size is " + n);
    k = k % n;
    console.log("Rotating array by " + k + " positions");   
    if (n == 0) {
        return arr;
    }

    reverse(arr, 0, n - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, n - 1); 
    return arr;
}

let arr2 = [1, 2, 3, 4, 5, 6, 7];
console.log(right_roteate(arr2, 3));
