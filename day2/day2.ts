

function occurrence(s: string, l: string) {
    let i = 0;
    for (const c of s) {
        if (c === l) i++
    }
    return i;
}

function readUntilSep(s: string, sep: string) {
    const i = s.indexOf(sep);
    if (i !== -1) return {
        token: s.substring(0, i),
        end: s.substring(i + sep.length)
    }
    throw `Can't find ${sep}`;
}

const input = await Deno.readTextFile("day2/input.txt");
const l = input.split("\n").map(line => {
    // 10-17 z: zszzzrzczxzfzzzzlz
    const a = readUntilSep(line, "-");
    const lowest = parseInt(a.token);
    const b = readUntilSep(a.end, " ");
    const highest = parseInt(b.token);
    const c = readUntilSep(b.end, ": ");
    const letter = c.token;
    const password = c.end;
    return {
        lowest,
        highest,
        letter,
        password
    }
});

const firstResult = l.filter(({ letter, password, lowest, highest }) => {
    const count = occurrence(password, letter);
    return count >= lowest && count <= highest
});
console.log(firstResult.length)

const secondResult = l.filter(({ password, letter, lowest, highest }) => {
    return (password[lowest - 1] === letter) !== (password[highest - 1] === letter)
});
console.log(secondResult.length)

// Fixes "Cannot redeclare block-scoped variable" issue when having multiple files
export {};

