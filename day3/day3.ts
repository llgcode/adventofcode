const debug = false;

function hasTree(line: string, j: number) {
    const tree = line[j % (line.length)] === "#";
    if (debug) {
        const extLine = line.repeat(Math.abs(j / line.length) + 1);
        const tree2 = extLine[j] === "#";
        console.log(`${extLine.substring(0, j) + (tree2 ? "X" : "0") + extLine.substring(j + 1)} ${j} ${tree}, ${tree2}`);
    } return tree;
}

type Slope = {right: number, down: number};

async function compute(slopes: Slope[], inputFile: string) {
    const input = await Deno.readTextFile(inputFile);
    const lines = input.split("\n").map(line => line.trim());
    const trees = new Array(slopes.length).fill(0);

    lines.forEach((line, n) => {
        slopes.forEach((slope, i) => {
            const lines = n / slope.down;
            if (lines && n % slope.down === 0) {
                if (hasTree(line, lines * slope.right)) trees[i]++;
            }
        });
    });
    
    console.log(trees.join(" * ") + " = " + trees.reduce((acc, trees) => acc * trees, 1));
    
}

const slopes = [
    {right: 1, down: 1},
    {right: 3, down: 1},
    {right: 5, down: 1},
    {right: 7, down: 1},
    {right: 1, down: 2}
];
await compute(slopes, "day3/exampleInput.txt");
await compute(slopes, "day3/input.txt");

export {};
