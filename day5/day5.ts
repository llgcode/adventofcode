
type Code = "F" | "B" | "L" | "R";

type Range = {
    lower: number,
    upper: number
}

function computeNewRange(code: Code, range: Range) {
    const half = (range.upper - range.lower + 1) / 2;
    switch (code) {
        case "F": case "L":
            return {
                lower: range.lower,
                upper: range.lower + half - 1
            }
        case "B": case "R":
            return {
                lower: range.upper - half + 1,
                upper: range.upper 
            }
    }
}

const debug = false;
function computeRanges(seatCode: string, upper: number) {
    const result = Array.from(seatCode).reduce((range, h)=> {
        if (debug) console.log(range)
        return computeNewRange(h as Code, range);
    }, {lower: 0, upper: upper});
    return result.lower;
}

type Seat = {
    row: number;
    column: number;
};

function computeSeat(seatCode: string) {
    const row = computeRanges(seatCode.substring(0, 7), 127);
    const column = computeRanges(seatCode.substring(7, 10), 7);
    return {
        row,
        column
    }
}

function seatId(seat: Seat) {
    return seat.row * 8 + seat.column;
}

async function seatIds(file: string) {
    const input = await Deno.readTextFile(file);
    const l = input.split("\n").map(seatCode => seatId(computeSeat(seatCode)));
    return l;
}

function highest(seatIds: number[]) {
    return seatIds.reduce((highest, seatId) => highest > seatId ? highest : seatId)
}


console.log(highest(await seatIds("day5/exampleInput.txt")));
const seats = await seatIds("day5/input.txt");
console.log(highest(seats));

seats.sort((a, b) => a - b);
seats.find((seat, i) => {
    const missing = seats[0] + i !== seat;
    if (missing) console.log(seats[0] + i);
    return missing;
});

export {}
