const debug = false;

function parseInput(input: string) {
    return input
        .split("\r\n")
        .map(row => Array.from(row));
}

function adjacents(data: ReturnType<typeof parseInput>, i: number, j: number) {
    const adj = [];
    if (i > 0) {
        adj.push(data[i - 1][j] // Up
            , data[i - 1][j - 1] // Up Left
            ,data[i - 1][j + 1]); // Up Right
    }
    adj.push(data[i][j - 1] // Left
        ,data[i][j + 1]); // Right
    if (i + 1 < data.length) {
        adj.push(data[i + 1][j] // Down
            , data[i + 1][j - 1] // Down Left
            ,data[i + 1][j + 1]); // Down Right
    }
    return adj;
}

function visibles(data: ReturnType<typeof parseInput>, i: number, j: number) {
    const visibles = [];
    const visible = (i: number, j: number, idir: number, jdir: number) => {
        while(true) {
            i += idir;
            j += jdir;
            if (i < 0 || i >= data.length || j < 0 || j >= data[0].length) return undefined;
            if (data[i][j] !== ".") return data[i][j];
        }
    }
    
    visibles.push(visible(i, j, 1, 0)); // down
    visibles.push(visible(i, j, 1, -1)); // down left
    visibles.push(visible(i, j, 1, 1)); // down right
    visibles.push(visible(i, j, 0, 1)); // right
    visibles.push(visible(i, j, 0, -1)); // left
    visibles.push(visible(i, j, -1, 0)); // up
    visibles.push(visible(i, j, -1, -1)); // up left
    visibles.push(visible(i, j, -1, 1)); // up right
    return visibles;
}

function compute(data: ReturnType<typeof parseInput>, 
        visibles: (data: ReturnType<typeof parseInput>, i: number, j: number) => (string | undefined)[],
        minOccupied: number) {
    while (true) {
        let changes = 0;
        data = data.map((row, i) => {
            return row.map((seat, j) => {
                if (seat === "L" && !visibles(data, i, j).includes("#")) {
                    changes++;
                    return "#";
                } else if (seat === "#" && 
                        visibles(data, i, j).reduce((acc, adj) => adj === "#" ? acc + 1 : acc, 0) >= minOccupied) {
                        changes++;
                    return "L";
                }
                return seat;
            });
        });
        if (debug) console.log(data.map(row => row.join()).join("\n") + "\n");
        if (changes === 0) {
            return data.reduce(
                    (acc, row) => 
                    row.reduce(
                        (acc, seat) => 
                            seat === "#" ? acc + 1 : acc
                        , acc)
                    , 0);
        }
    }
}


function firstPart(data: ReturnType<typeof parseInput>) {
    return compute(data, adjacents, 4);
}


function secondPart(data: ReturnType<typeof parseInput>) {
    return compute(data, visibles, 5);
}

const example = parseInput(await Deno.readTextFile("day11/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day11/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
