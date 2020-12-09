const debug = false;

function parseInput(input: string) {
    return input
        .split("\r\n")
        .map(n => parseInt(n))
}

function firstPart(data: ReturnType<typeof parseInput>, preambule = 25) {
    return data.slice(preambule).find((n, i) => {
        const prev = data.slice(i, preambule + i);
        return !prev.some(o1 => prev.some(o2 => {
            if (debug) console.log(`${o1} + ${o2} === ${o1 + o2}`);
            return o1 + o2 === n;
        }));
    });
}

function secondPart(data: ReturnType<typeof parseInput>, preambule = 25) {
    const invalid = firstPart(data, preambule);
    if (invalid === undefined) throw "First part doesn't find the invalid number"
    const searchContiguous = (data: number[]) => {
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 2; j < data.length; j++) {
                const slice = data.slice(i, j);
                const sum = slice.reduce((acc, n) => acc + n, 0);
                if (sum === invalid) {
                    slice.sort((a1, a2) => a1 - a2)
                    return {
                        slice,
                        smallest: slice[0],
                        largest: slice[slice.length - 1]
                    };
                } else if (sum > invalid) {
                    break;
                }
            }
        }
    }

    const result = searchContiguous(data);
    if (result) {
        return result.smallest + result.largest;
    }
    throw "not found";
}

const example = parseInput(await Deno.readTextFile("day9/exampleInput.txt"));
console.log(firstPart(example, 5));
console.log(secondPart(example, 5));

const input = parseInput(await Deno.readTextFile("day9/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
