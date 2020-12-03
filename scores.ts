
interface Member {
    id: string;
    name: string | null;
    last_star_ts: string; // unix time
    global_score: number;
    local_score: number;
    stars: number;
    completion_day_level: {
        [day: string]: {
            [star: string]: {
                get_star_ts: string // unix time
            }
        }
    };
}

interface Scores {
    members: { [id: string]: Member };
}

async function displayScoreTable(scoreAddress: string, cookie: string) {
    const response = await fetch(scoreAddress, {
        headers: { cookie }
    });
    if (!response.ok) throw `Can't retrieve scores ${scoreAddress}`;

    const scores: Scores = await response.json();

    const nameMaxLen = Object.entries(scores.members).reduce((acc, [id, member]) => acc > (member.name + "").length ? acc : (member.name + "").length, 0);
    const fill = new Array(nameMaxLen - 6).fill(" ").join("");
    const table = [`[rank]\t[name]${fill}[global]\t[local]\t[day->[stars time]]`];
    table.push(...Object.entries(scores.members)
        .sort(([ida, membera], [idb, memberb]) => memberb.local_score - membera.local_score)
        .map(([id, member]) => member)
        .map((member, i) => {
            const times = Object.entries(member.completion_day_level)
                .sort(([daya], [dayb]) => parseInt(daya) - parseInt(dayb))
                .map(([day, dayscore]) =>
                    Object.entries(dayscore)
                        .sort(([stara], [starb]) => parseInt(stara) - parseInt(starb))
                        .map(([star, time]) => dateToString(new Date(parseInt(time.get_star_ts) * 1000)))
                );
            const starsTime = times.map((stars, day) => `${day + 1}->[${stars.join(" ")}]`).join("\t");
            const fill = new Array(nameMaxLen - (member.name + "").length).fill(" ").join("") + " ";
            return `${i + 1}\t${member.name}${fill}${member.global_score}\t\t${member.local_score}\t${starsTime}`;
        }));
    return {
        scores,
        table
    }
}

function dateToString(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// "https://adventofcode.com/2020/leaderboard/private/view/355982.json"
const address = Deno.args[0];
const cookie = Deno.args[1];
const { scores, table } = await displayScoreTable(address, cookie);
console.log(table.join("\n"))
