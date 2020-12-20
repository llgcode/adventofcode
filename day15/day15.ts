const debug = false;

function firstPart(data: number[], n: number) {
    const db: Record<number, number> = new Array(n);
    let i = 1;
    let last = data[0];
    while (i < n) {
        let v;
        if (i < data.length) 
            v = data[i];
        else if (db[last] === undefined) 
            v = 0;
        else 
            v = i - db[last];
        db[last] = i;
        last = v;
        i++;
    }
    return last
}

console.log(firstPart([0, 3, 6 ], 2020), 436); 
console.log(firstPart([1,3,2 ], 2020), 1 ); 
console.log(firstPart([2,1,3 ], 2020), 10); 
console.log(firstPart([1,2,3], 2020), 27); 
console.log(firstPart([2,3,1], 2020), 78); 
console.log(firstPart([3,2,1], 2020), 438); 
console.log(firstPart([3,1,2], 2020), 1836); 
console.log(firstPart([9,12,1,4,17,0,18], 2020), 610); 
console.log(firstPart([0, 3, 6 ], 30000000), 175594); 
console.log(firstPart([1,3,2], 30000000), 2578); 
console.log(firstPart([2,1,3], 30000000), 3544142); 
console.log(firstPart([1,2,3], 30000000), 261214); 
console.log(firstPart([2,3,1], 30000000), 6895259); 
console.log(firstPart([3,2,1], 30000000), 18); 
console.log(firstPart([3,1,2], 30000000), 362); 
console.log(firstPart([9,12,1,4,17,0,18], 30000000)); // 

export { }
          