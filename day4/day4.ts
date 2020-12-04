
const newline = "\r\n";

function readUntil(s: string, ...seps: string[]) {
    let i = 0;
    while (true) {
        if (i === s.length) {
            return {
                node: s.substring(0, i)
            }
        }
        const sep = seps.find((sep) => s.substring(0, i + 1).endsWith(sep));
        if (sep) {
            return {
                node: s.substring(0, i - (sep.length - 1)),
                tail: s.substring(i + 1),
                sep
            }
        }
        i++;
    }
}

function readKeyValue(s: string) {
    let parsing = readUntil(s, ":");
    const key = parsing.node;
    if (!parsing.tail) 
        throw "no value";
    parsing = readUntil(parsing.tail, " ", newline);
    const value = parsing.node;
    return { node: {key, value} , tail: parsing.tail, sep: parsing.sep };
}

interface Parsing<N> {
    tail?: string;
    sep?: string;
    node?: N;
}

type Passport = Record<string, string>;

function readPassport(s: string) {
    const passport: Passport = {};
    while (true) {
        const parsing = readKeyValue(s);
        passport[parsing.node.key] = parsing.node.value;
        if (parsing.tail) {
            s = parsing.tail.trimLeft();
            if (parsing.sep === newline && parsing.tail.startsWith(newline)) {
                return {node: passport, tail: s, sep: parsing.sep};
            }
        } else {
            return {node: passport};
        }
        
    }
}

function readPassports(s: string) {
    const passports: Passport[] = []
    while (true) {
        const parsing = readPassport(s);
        passports.push(parsing.node);
        if (parsing.tail) {
            s = parsing.tail;
        } else {
            return passports;
        }
    }
}

const fields = {
    byr: "Birth Year",
    iyr: "Issue Year",
    eyr: "Expiration Year",
    hgt: "Height",
    hcl: "Hair Color",
    ecl: "Eye Color",
    pid: "Passport ID",
    cid: "Country ID"
}

function isDigit(s: string) {
    return Array.from(s).every(l => /[0-9]/.test(l));
}
function isHexaChar(s: string) {
    return Array.from(s).every(l => /[0-9a-f]/.test(l));
}

function readNumber(s: string) {
    let i = 0;
    while(i < s.length && isDigit(s[i])) {
        i++;
    }
    if (i === 0) return {};
    return { node: parseInt(s.substring(0, i)), tail: s.substring(i)}
}

const validFields: Record<string, {validate(s: string): boolean}> = {
    "byr": { 
        // byr (Birth Year) - four digits; at least 1920 and at most 2002.
        validate(v: string): boolean {
            if (v.length !== 4) return false;
            if (!isDigit(v)) return false;
            const i = parseInt(v);
            return i >= 1920 && i <= 2002;
        }
    },
    "iyr": { 
        // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
        validate(v: string): boolean {
            if (v.length !== 4) return false;
            if (!isDigit(v)) return false;
            const i = parseInt(v);
            return i >= 2010 && i <= 2020;
        }
    },
    "eyr": { 
        // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
        validate(v: string): boolean {
            if (v.length !== 4) return false;
            if (!isDigit(v)) return false;
            const i = parseInt(v);
            return i >= 2020 && i <= 2030;
        }
    },
    "hgt": { 
        // hgt (Height) - a number followed by either cm or in:
        // - If cm, the number must be at least 150 and at most 193.
        // - If in, the number must be at least 59 and at most 76.
        validate(v: string): boolean {
            const parsing = readNumber(v);
            if (parsing.node === undefined) return false;
            switch(parsing.tail) {
                case "cm": return parsing.node >= 150 && parsing.node <= 193;
                case "in": return parsing.node >= 59 && parsing.node <= 76;
            }
            return false;
        }
    },
    "hcl": {
        // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f. 
        validate(v: string): boolean {
            if (v.length !== 7) return false;
            if (v[0] !== "#") return false;
            return isHexaChar(v.substring(1));
        }
    },
    "ecl": {
        // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth. 
        validate(v: string): boolean {
            return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].some(ecl => ecl === v);
        }
    },
    "pid": {
        // pid (Passport ID) - a nine-digit number, including leading zeroes. 
        validate(v: string): boolean {
            return isDigit(v) && v.length === 9;
        }
    },
    // cid (Country ID) - ignored, missing or not.
};

const tests: [string, boolean, string][] = [
    ["byr", true,    "2002"],
    ["byr", false,  "2003"],
    ["hgt", true,    "60in"],
    ["hgt", true,    "190cm"],
    ["hgt", false,  "190in"],
    ["hgt", false,  "190"],
    ["hcl", true,    "#123abc"],
    ["hcl", false,  "#123abz"],
    ["hcl", false,  "123abc"],
    ["ecl", true,    "brn"],
    ["ecl", false,  "wat"],
    ["pid", true,    "000000001"],
    ["pid", false,  "0123456789"],
]

console.log(tests.every(([field, valid, v]) => {
    return validFields[field].validate(v) === valid;
}));

const debug = false;
async function validate(inputFile: string) {
    const input = await Deno.readTextFile(inputFile);
    const passports = readPassports(input);
    if (debug) {
        console.log(JSON.stringify(passports, undefined, "  "));
    }
    const rightFieldPassports = readPassports(input).filter(passport => 
        Object.entries(validFields).every(([field]) => passport.hasOwnProperty(field))
        );
    const validPassports = rightFieldPassports.filter(passport => Object.entries(validFields).every(([field, v]) => v.validate(passport[field])));
    console.log(passports.length + " " + rightFieldPassports.length + " " + validPassports.length);
}

await validate("day4/exampleInput.txt")
await validate("day4/input.txt")

export {}
