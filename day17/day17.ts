const debug = false;

type State = "." | "#";

interface World {
    min: number[],
    max: number[],
    data: { [id: string]: State };
}

function toWorld(input: State[][], dim: number) {
    const min = new Array(dim).fill(0);
    const max = new Array(dim).fill(0);
    max[0] = input[0].length - 1;
    max[1] = input.length - 1;
    const world: World = {
        min,
        max,
        data: {}
    };
    const pos = new Array(dim).fill(0)
    input.forEach((row, y) => {
        row.forEach((cube, x) => {
            pos[0] = x;
            pos[1] = y;
            setCube(world, pos, cube);
        })
    });
    return world;
}

function setCube(world: World, pos: number[], state: State) {
    const id = pos.join(":");
    if (state === ".") {
        delete world.data[id];
        return;
    }
    // resize
    pos.forEach((v, i) => {
        if (world.min[i] > v) world.min[i] = v;
        if (world.max[i] < v) world.max[i] = v;
    });
    world.data[id] = state;
}

function getCube(world: World, pos: number[]): State {
    const id = pos.join(":");
    const cube = world.data[id];
    if (cube === "#") return "#";
    return ".";
}

function getNeighbors(data: World, pos: number[]) {
    const steps = [-1, 0, 1];
    const neighbours: State[] = [];
    const nrec = (p: number[], i: number) => {
        if (i < pos.length) {
            steps.forEach(step => {
                const newp = p.slice();
                newp[i] += step;
                nrec(newp, i + 1);
            });
        } else if (!p.every((v, i) => pos[i] === p[i])) {
            neighbours.push(getCube(data, p));            
        }
    }
    nrec(pos.slice(), 0);
    return neighbours;
}

function newState(world: World, pos: number[]) {
    const cube = getCube(world, pos);
    const neighbours = getNeighbors(world, pos);
    const actives = neighbours.filter(state => state === "#");
    if (actives.length === 3 || (actives.length === 2 && cube === "#")) {
        return "#";
    }
    return ".";
}

function display(world: World) {
    const displayRec = (p: number[], i: number, row: unknown[]) => {
        if (i >= 0) {
            const r: State[] = [];
            for (let d = world.min[i]; d <= world.max[i]; d++) {
                p[i] = d;
                displayRec(p, i - 1, r);
            }
            row.push(r);
        } else {
            row.push(getCube(world, p));
        }
    }
    const cubes: unknown[] = [];
    displayRec(world.min.slice(), world.min.length - 1, cubes);

    const logRec = (array: unknown[]) => {
        if (typeof array[0] === "string") {
            console.log(array.join(""));
        } else {
            array.forEach((a, z) => {
                logRec(a as unknown[]);
            })
            if (typeof (<unknown[]>array[0])[0] === "string") {
                console.log("");
            }
        }
    }
    logRec(cubes);
    return cubes;
}

function cycle(world: World) {
    // clone to a new world
    const newWorld = { 
        min: world.min.slice(), 
        max: world.max.slice(), 
        data: { ...world.data }
    }
    const cycleRec = (p: number[], i: number) => {
        if (i < world.max.length) {
            for (let d = world.min[i] - 1; d <= world.max[i] + 1; d++) {
                p[i] = d;
                cycleRec(p, i + 1);
            }
        } else {
            setCube(newWorld, p, newState(world, p));
        }
    }
    cycleRec(world.min.slice(), 0);
    return newWorld;
}

function firstPart(world: World) {
    for (let i = 0; i < 6; i++) {
        world = cycle(world);
    }
    return Object.keys(world.data).length;
}

function secondPart(data: World) {


}

const example: State[][] = [
    [".", "#", "."],
    [".", ".", "#"],
    ["#", "#", "#"]
];
const input: State[][] =[
    [".", ".", ".", "#", "#", "#", ".", "#"],
    ["#", ".", "#", ".", "#", "#", ".", "."],
    [".", "#", "#", ".", "#", "#", ".", "."],
    [".", ".", "#", "#", ".", ".", ".", "#"],
    [".", "#", "#", "#", ".", "#", "#", "."],
    [".", "#", ".", ".", "#", "#", ".", "."],
    [".", ".", ".", ".", ".", "#", "#", "#"],
    [".", "#", "#", "#", "#", ".", ".", "#"]
];

console.log(firstPart(toWorld(example, 3)));
console.log(firstPart(toWorld(input, 3)));

console.log(firstPart(toWorld(example, 4)));
console.log(firstPart(toWorld(input, 4)));


export { }
