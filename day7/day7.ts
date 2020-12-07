const debug = true;

type Rules = Record<string, Record<string, number>>;

function containsColor(rules: Rules, color: string, set: Set<string>): Set<string> {
    return Object.entries(rules)
        .reduce(
            (set, [c, contains]) => {
                if (contains.hasOwnProperty(color) && !set.has(c)) {
                    if (debug) console.log(c + " contains " + color)
                    set.add(c);
                    containsColor(rules, c, set);
                }
                return set;
            }, set)
}

function countBag(rules: Rules, color: string): number {
    return  Object
        .entries(rules[color])
        .reduce((count, 
            [c, countColor]) => count + countColor * (countBag(rules, c) + 1)
            , 0);
}

function compute(input: string) {
    const rules: Rules = {};
    input.split("\r\n")
        .map((rule) => rule.split(" bags contain "))
        .forEach(([color, rule]) => {
            const contains: Record<string, number> = {};
            if (!rule.startsWith("no other")) {
                rule.split(", ")
                    .forEach((colors) => {
                        const split = colors.split(" ");
                        contains[split[1] + " " + split[2]] = parseInt(split[0]);
                    });
            }
            rules[color] = contains;
        });
    if (debug) console.log(rules);
    return {
        partOne: containsColor(rules, "shiny gold", new Set()).size,
        partTwo: countBag(rules, "shiny gold")
    };
}

console.log(compute(await Deno.readTextFile("day7/exampleInput.txt")));
console.log(compute(await Deno.readTextFile("day7/input.txt")));

export { }
