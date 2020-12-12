const debug = false;

function parseInput(input: string) {
    return input
        .split("\r\n")
        .map(n => parseInt(n)).sort((a1, a2) => a1 - a2)
}

function firstPart(data: ReturnType<typeof parseInput>) {
    const joltsDiff = data.reduce((joltsDiff, rating, i) => {
        if (i + 1 < data.length) {
            joltsDiff[data[i + 1] - rating - 1]++;
        }
        return joltsDiff;
    }, [1, 0, 1]);
    return joltsDiff[0] * joltsDiff[2];
}

function secondPart(data: ReturnType<typeof parseInput>) {
    const diff =  [1];
    data.forEach((rating, i) => {
        if (i + 1 < data.length) {
            diff.push(data[i + 1] - rating);
        } else {
            diff.push(3);
        }
    });
    return diff.reduce((acc, rating, i) => {
        if (rating === 1 && diff[i + 1] === 1) {
            acc.prev++;
        } else {
            if (acc.prev > 0) {
                acc.combi *= Math.pow(2, acc.prev) - (acc.prev > 2 ? 1: 0);
            }
            acc.prev = 0;
        }
        return acc;
    }, {prev: 0, combi: 1}).combi;
}

const example = parseInput(await Deno.readTextFile("day10/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day10/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
