
const debug = false;
async function compute(file: string) {
    const input = await Deno.readTextFile(file);
    const groups = input
        .split("\r\n\r\n");
    const partOne = groups 
        .map(group => group.replaceAll("\r\n", ""))
        .map(answers => {
            if (debug) console.log(answers);
            return answers;
        })
        .map(answers => new Set(answers))
        .map(yes => {
            if (debug) console.log(yes);
            return yes.size;
        })
        .reduce((result, count) => result + count, 0);
    const partTwo = groups
        .map(group => group.split("\r\n"))
        .map(person => person.map(answer => Array.from(answer)))
        .map(person => person.reduce(
            (yess, answers) => answers.filter(answer => yess.includes(answer)),
            person[0]
            ).length)
        .reduce((result, count) => result + count, 0);
    return {
        partOne,
        partTwo
    }
}

console.log(await compute("day6/exampleInput.txt"));
console.log(await compute("day6/input.txt"));

export {}