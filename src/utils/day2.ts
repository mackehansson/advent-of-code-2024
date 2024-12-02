const rows = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
const row = "8 6 4 4 1";

const lines = rows.trim().split("\n");

function run(allRows: string[]) {
    const result = allRows.reduce((acc, curr) => {
        const safeRow = isSafe(curr);
        if (!safeRow) return acc;

        return acc + 1;
    }, 0);

    console.log(result);
}

run(lines);

function isSafe(row: string) {
    const splitted = row.split(" ").map(Number);
    let safe = true;

    let previousNumber = 0;
    let allIncreasing: boolean | null = null;
    let allDecreasing: boolean | null = null;
    let equalValue: boolean | null = null;
    
    for (let i = 0; i < splitted.length; i++) {
        const report = splitted[i];
        if (i === 0) {
            previousNumber = report;
            
            const nextNumber = splitted[i + 1];

            if (nextNumber > report) {
                allDecreasing = false;
                allIncreasing = true;
            } else if (nextNumber < report) {
                allDecreasing = true;
                allIncreasing = false;
            } else {
                allDecreasing = null;
                allIncreasing = null;
                equalValue = true;
                safe = false;
                break;
            }
            continue;
        }

        const stepIs = previousNumber - report;
        const nextNumber = splitted[i + 1];

        if (previousNumber === report) {
            safe = false;
            break;
        }

        if (allIncreasing) {
            if (nextNumber < report) {
                console.log("34")
                safe = false;
                break;
            }
        }

        if (allDecreasing) {
            if (nextNumber > report) {
                console.log("42")
                safe = false;
                break;
            }
        }
        

        if (Math.abs(stepIs) > 3) {
            console.log("50")
            safe = false;
            break;
        }

        previousNumber = report;
    }

    return safe;
}