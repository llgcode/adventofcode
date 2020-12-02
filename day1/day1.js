// @ts-check
const fs = require("fs")
let rawdata = fs.readFileSync("day1/input.txt");
let l = JSON.parse(rawdata.toString());

l.some(n1 => 
    l.some(n2 => {
        if (n1 + n2 === 2020) {
            console.log(`${n1} + ${n2} = ${n1+n2}`);
            console.log(`${n1} * ${n2} = ${n1*n2}`);
        }
        return l.some(n3 => {
            if (n1 + n2 + n3 === 2020) {
                console.log(`${n1} + ${n2} + ${n3} = ${n1+n2+n3}`);
                console.log(`${n1} * ${n2} * ${n3} = ${n1*n2*n3}`);
                return true
            }
            return false;
        });
    })
);
console.log("end")
