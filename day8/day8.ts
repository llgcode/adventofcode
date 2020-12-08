const debug = true;

type Operation = "acc" | "jmp" | "nop";
type ExitCode = "ok" | "infinite";

function parseInput(input: string) {
    return input
        .split("\r\n")
        .map(instruction => instruction.split(/\s/))
        .map(instruction => {
            return {
                op: instruction[0]  as Operation,
                value: parseInt(instruction[1])
            }
        })
}

function execute(program: ReturnType<typeof parseInput>) {
    const stack = new Array<number>();
    let cursor = 0;
    let acc = 0;
    while (true) {
        const instruction = program[cursor];
        if (!instruction) {
            // No instruction here
            return {
                exitCode: "ok" as ExitCode,
                stack,
                acc
            };
        }
        if (stack.includes(cursor)) {
            // infinite loop
            return {
                exitCode: "infinite" as ExitCode,
                stack,
                acc
            };
        }
        stack.push(cursor);
        switch(program[cursor].op) {
            case "acc": 
                acc += program[cursor].value;
                cursor++;
                break;
            case "jmp": 
                cursor += program[cursor].value;
                break;
            case "nop": 
                cursor++;
                break;
        }
    }
}
function firstPart(program: ReturnType<typeof parseInput>) {
    return execute(program).acc;
}

function secondPart(program: ReturnType<typeof parseInput>) {
    let p = execute(program);
    const stack = p.stack;
    while (p.exitCode === "infinite") {
        const last = stack.pop();
        if (last === undefined) throw "no more";
        switch(program[last].op) {
            case "jmp": 
                program[last].op = "nop";
                break;
            case "nop": 
                program[last].op = "jmp";
                break;
        }
        p = execute(program);
    }
    return p.acc;
}

const example = parseInput(await Deno.readTextFile("day8/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day8/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
