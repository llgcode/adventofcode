const debug = false;

interface Navigation extends Position {
    dir: Position
}

interface Position {
    x: number;
    y: number;
}

const actions = {
    "N": { //  means to move north by the given value.
        navigate(pos: Position, value: number) {
            pos.y -= value;
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav.dir, value);
        }
    }, 
    "S": { //  means to move south by the given value.
        navigate(pos: Position, value: number) {
            pos.y += value;
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav.dir, value);
        }
    }, 
    "E": { //  means to move east by the given value.
        navigate(pos: Position, value: number) {
            pos.x += value;
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav.dir, value);
        }
    }, 
    "W": { //  means to move west by the given value.
        navigate(pos: Position, value: number) {
            pos.x -= value;
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav.dir, value);
        }
    }, 
    "L": { //  means to turn left the given number of degrees.
        navigate(nav: Navigation, value: number) {
            const n = value / 90;
            // EATH x:1, y:0 -> NORTH x:0, y:-1
            // NORTH x:0, y:-1 -> WEST x:-1, y:0
            // WEST x:-1, y:0 -> SOUTH x:0, y:1
            // SOUTH x:0, y:1 -> EATH x:1, y:0
            for (let i = 0; i < n; i++) {
                const {x, y} = nav.dir;
                nav.dir.x = y;
                nav.dir.y = -x;
            }
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav, value);
        }
    }, 
    "R": { //  means to turn right the given number of degrees.
        navigate(nav: Navigation, value: number) {
            const n = value / 90;
            // EATH x:1, y:0 -> SOUTH x:0, y:1
            // SOUTH x:0, y:1 -> WEST x:-1, y:0
            // WEST x:-1, y:0 -> NORTH x:0, y:-1
            // NORTH x:0, y:-1 -> EATH x:1, y:0
            for (let i = 0; i < n; i++) {
                const {x, y} = nav.dir;
                nav.dir.x = -y;
                nav.dir.y = x; 
            }
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav, value);
        }
    }, 
    "F": { //  means to move forward by the given value in the direction the ship is currently facing.
        navigate(nav: Navigation, value: number) {
            nav.x += value * nav.dir.x;
            nav.y += value * nav.dir.y;
        },
        navigate2(nav: Navigation, value: number) {
            this.navigate(nav, value);
        }
    }, 
};

type ActionType = keyof typeof actions;

function parseInput(input: string) {
    return input
        .split("\r\n")
        .map(row => ({ action: row[0], value: parseInt(row.substring(1))}));
}

function firstPart(data: ReturnType<typeof parseInput>, ) {
    const navigation = {
        x: 0, y: 0,
        dir: { x: 1, y: 0}
    };
    data.forEach((inst) => {
        actions[inst.action as ActionType].navigate(navigation, inst.value)
        if (debug) console.log(inst, navigation);
    });
    return Math.abs(navigation.x) + Math.abs(navigation.y);
}


function secondPart(data: ReturnType<typeof parseInput>) {
    const navigation = {
        x: 0, y: 0,
        dir: { x: 10, y: -1 }
    };
    data.forEach((inst) => {
        actions[inst.action as ActionType].navigate2(navigation, inst.value)
        if (debug) console.log(inst, navigation);
    });
    return Math.abs(navigation.x) + Math.abs(navigation.y);
}

const example = parseInput(await Deno.readTextFile("day12/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day12/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
