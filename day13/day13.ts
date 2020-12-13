const debug = false;

function parseInput(input: string) {
    const data = input.split("\r\n");
    return {
        timestamp: parseInt(data[0]),
        buses: data[1].split(",").map((bus, n) => ({ id: parseInt(bus), n})).filter(bus => !isNaN(bus.id))
    }
}

function firstPart(data: ReturnType<typeof parseInput>) {
   const result = data.buses
                .map(bus => ({ ...bus, delay: bus.id - (data.timestamp % bus.id)}))
                .sort((a1, a2) => a1.delay - a2.delay)[0];
   return result.delay * result.id; 
}


function secondPart(data: ReturnType<typeof parseInput>) {
    return data.buses.reduce(({t, inc}, bus) => {
        while ((t + bus.n) % bus.id !== 0) {
            t += inc;
        }
        inc *= bus.id;
        return {t, inc};
    }, {t: data.buses[0].id, inc: 1}).t;  

}

const example = parseInput(await Deno.readTextFile("day13/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day13/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
