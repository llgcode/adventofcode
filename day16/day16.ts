const debug = false;
interface Data {
    fields: {
        field: string, 
        ranges: number[][];
    }[];
    your: number[];
    nearby: number[][];
}
function parseInput(input: string) {
    const data: Data = {
        fields: [],
        your: [],
        nearby: []
    }
    let field: string | undefined;
    input.split("\r\n").forEach(line => {
        if (field === "nearby tickets" && line.length > 0) {
            data.nearby.push(line.split(",").map(n => parseInt(n)));
            return;
        }
        const indexOf = line.indexOf(":");
        if (indexOf !== -1) {
            field = line.substring(0, indexOf);
            if (indexOf < line.length - 1) {
                // range 
                const ranges = line.substring(indexOf + 1).split(" or ").map(range => range.split("-").map(n => parseInt(n)));
                data.fields.push({field, ranges});
            }
        } else if (field === "your ticket" && line.length > 0) {
            data.your = line.split(",").map(n => parseInt(n));
        }
    });
    return data;
}


function firstPart(data: ReturnType<typeof parseInput>) {
    return data.nearby.reduce((acc, ticket) => 
            acc + ticket.filter(n =>
                !data.fields.find(({field, ranges}) => 
                    ranges.find(range => n >= range[0] && n <= range[1])
                    )
            ).reduce((acc, v) => acc + v, 0), 0
    );
}

function secondPart(data: ReturnType<typeof parseInput>) {
   
    const valids = data.nearby.filter(ticket => 
            ticket.every(n =>
                data.fields.find(({field, ranges}, i) =>  
                    ranges.find(range => n >= range[0] && n <= range[1]))
            )
    );
    console.log(valids.length);
    
    
    const len = data.nearby[0].length;
    const search = (fields: Data["fields"], i: number) => {
        return data.fields.filter(({field, ranges}) => 
            ranges.find(range => data.your[i] >= range[0] && data.your[i] <= range[1]) &&
            valids.every((ticket) => ranges.find(range => ticket[i] >= range[0] && ticket[i] <= range[1]))
        );
    }

    const fieldsOrder: string[][] = data.fields.map(() =>  []);
    for (let i = 0; i < len; i++) {
        const found = search(data.fields, i);
        found.forEach(field =>  {
            fieldsOrder[i].push(field.field);
        });        
    }
    let alones = fieldsOrder.filter(fields => fields.length === 1);
    while(alones.length !== fieldsOrder.length) {
        alones.forEach(alone => 
            fieldsOrder.forEach((fields, i) => {
                if (fields.length !== 1) {
                    fieldsOrder[i] = fields.filter(field => field !== alone[0])
                }
        }));
        alones = fieldsOrder.filter(fields => fields.length === 1);
    }
    
    return fieldsOrder.map(fields => fields[0]).reduce((acc, field, i) => field.startsWith("departure ") ? acc * data.your[i] : acc, 1);
}

const example = parseInput(await Deno.readTextFile("day16/exampleInput.txt"));
console.log(firstPart(example));
console.log(secondPart(example));

const input = parseInput(await Deno.readTextFile("day16/input.txt"));
console.log(firstPart(input));
console.log(secondPart(input));

export { }
