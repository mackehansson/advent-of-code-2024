import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function checkIfLevelIsValid(row: string) {
    const splitted = row.split(" ").map(Number);
    let safe = true;
    let previousNumber = 0;
    let increasing: boolean | null = null;

    for (let i = 0; i < splitted.length; i++) {
        const report = splitted[i];
        const nextNumber = splitted[i + 1];

        if (i === 0) {
            previousNumber = report;

            if (nextNumber > report) {
                increasing = true;
            } else if (nextNumber < report) {
                increasing = false;
            } else {
                increasing = null;
                safe = false;
                break;
            }
            continue;
        }

        if (previousNumber === report) {
            safe = false;
            break;
        }

        if (increasing !== null) {
            if (increasing) {
                if (nextNumber < report) {
                    safe = false;
                    break;
                }
            } else {
                if (nextNumber > report) {
                    safe = false;
                    break;
                }
            }
        }

        if (Math.abs(previousNumber - report) > 3) {
            safe = false;
            break;
        }

        previousNumber = report;
    }

    return safe;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput).split("\n");

    const result = input.reduce((acc, curr) => {
        const safeRow = checkIfLevelIsValid(curr);
        if (!safeRow) return acc;

        return acc + 1;
    }, 0);

    return result;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput).split("\n");

    const result = input.reduce((acc, curr) => {
        const safeRow = checkIfLevelIsValid(curr);

        if (!safeRow) {
            const currentRow = curr.split(" ").map(Number);

            let i = 0;
            const rowResults = [];
            while (i < currentRow.length) {
                const newRow = currentRow
                    .filter((_, index) => index !== i)
                    .join(" ");
                rowResults.push(checkIfLevelIsValid(newRow));
                i++;
            }
            if (rowResults.some(Boolean)) {
                return acc + 1;
            }

            return acc;
        }

        return acc + 1;
    }, 0);

    return result;
};

run({
    part1: {
        tests: [
            {
                input: `
              7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
                expected: 2,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
                expected: 4,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
