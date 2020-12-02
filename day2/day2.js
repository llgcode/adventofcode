// @ts-check
const fs = require("fs")

/** 
 * @param {string} s
 * @param {string} l
 */
function occurrence(s, l) {
    let i = 0;
    for (const c of s) {
        if (c === l) i++
    }
    return i;
}

/** 
 * @param {string} s
 * @param {string} sep
 * @return {{token: string, end: string}}
 */
function readUntilSep(s, sep) {
    const i = s.indexOf(sep);
    if (i !== -1) return {
        token: s.substring(0, i),
        end: s.substring(i + 1)
    }
    return null;
}

let rawdata = fs.readFileSync("day2/input.txt");
let l = rawdata.toString().split("\n").map(line => {
    // 10-17 z: zszzzrzczxzfzzzzlz
    const a = readUntilSep(line, "-");
    const lowest = parseInt(a.token);
    const b = readUntilSep(a.end, " ");
    const highest = parseInt(b.token);
    const c = readUntilSep(b.end, ":");
    const letter = c.token;
    const password = c.end.trim();
    return {
        lowest,
        highest,
        letter,
        password
    }
});
let firstResult = l.filter(({ letter, password, lowest, highest }) => {
    const count = occurrence(password, letter);
    return count >= lowest && count <= highest
});
console.log(firstResult.length)

let secondResult = l.filter(({ password, letter, lowest, highest }) => {
    return (password[lowest - 1] === letter) !== (password[highest - 1] === letter)
});
console.log(secondResult.length)

