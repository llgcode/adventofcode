const debug = false;

function parseInput(input: string) {
    const data = input.split("\r\n");
    return data.map(line => { 
        const stmt = line.split("=");
        if (stmt[0].startsWith("mask")) {
            return {mask: Array.from(stmt[1].trim()).reverse()};
        } else {
            const match = stmt[0].match(/mem\[([0-9]+)\]/);
            if (match) {
                return {
                    mem: parseInt(match[1]),
                    value: parseInt(stmt[1])
                }
            }
            throw "unrecognized string"
        }
    });
}


function firstPart(data: ReturnType<typeof parseInput>) {
    const memory: Record<number, number> = {};
    let m: string[] = [];
    data.forEach(({mask, mem, value}) => {
        if(mask) {
            m = mask;
        } else if (mem !== undefined && value !== undefined) {
            const bv = Array.from(value.toString(2)).reverse();
            memory[mem] = m.reduce((acc, bm, i) => {
                if (bm === "0") return acc;
                if (bm === "1" || bv[i] === "1") return acc + Math.pow(2, i);
                return acc;
            }, 0);
        }
    });
    return Object.entries(memory).reduce((acc, [index, value]) => acc + value, 0);
}


function computeValue(v: string[]) {
    return v.reduce((acc, bm, i) => {
        if (bm === "0") return acc;
        if (bm === "1") return acc + Math.pow(2, i);
        return acc;
    }, 0);
}



function computeAddresses(v: string[]) {
    const addrs: number[] = [];
    const floatings = v.reduce((acc, b, i) => b === "X" ? acc.concat(i) : acc, [] as number[]);

    const combi = (i: number) => {
        if (i >= floatings.length) {
            addrs.push(computeValue(v));
            return;
        }
        v[floatings[i]] = "0";
        combi(i + 1);
        v[floatings[i]] = "1";
        combi(i + 1);
    }
    combi(0);
    return addrs;
}

function secondPart(data: ReturnType<typeof parseInput>) {
    const memory: Record<number, number> = {};
    let m: string[] = [];
    data.forEach(({mask, mem, value}) => {
        if(mask) {
            m = mask;
        } else if (mem !== undefined && value !== undefined) {
            const mema = Array.from(mem.toString(2)).reverse();
            const addrs = computeAddresses(m.map((b, i) => {
                if (b === "X") return "X";
                if (b === "1") return "1";
                return mema[i] === "1" ? "1" : "0";
            }, 0));
            if (debug) console.log(addrs);
            addrs.forEach(addr => {
                memory[addr] = value;
            });
        }
    });
    return Object.entries(memory).reduce((acc, [index, value]) => acc + value, 0);
}

const example = parseInput(await Deno.readTextFile("day14/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day14/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
