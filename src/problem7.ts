let arr3=[11,16,21,8,9,10,12,13,14,15];

function rotate(arr3: number[],k:number): number[]{
    let n=arr3.length;
    console.log("Original array Size is " + n);
    k=k%n;
    console.log("Rotating array by " + k + " positions");
    let temp=[];    
    for(let i=0;i<k;i++){
        temp.push(arr3[n-k+i]);
    }
    for(let i=n-k-1;i>=0;i--){
        arr3[i+k]=arr3[i];
    }
    for(let i=0;i<k;i++){
        arr3[i]=temp[i];
    }
    return arr3;
}

console.log(rotate(arr3,3));
