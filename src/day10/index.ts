import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";
const parseInput = (rawInput: string) => rawInput;

type Trailhead = {
    height: number;
    trailheads: string[];
};

type TrailheadArray = Trailhead[][];

class PuzzleSolver {
    private grid: number[][];
    public table: TrailheadArray = [];
    public width: number = 0;
    public height: number = 0;

    constructor(private input: string, private variant: number = 1) {
        this.grid = getInputAsArray(input).map((x) => x.split("").map(Number));

        this.processInput(input);
        this.startTrails();
        this.continueTrails();
    }

    // Puzzle 1
    processInput(input: string) {
        const rawLines = input.split("\n");

        for (const rawLine of rawLines) {
            const line: Trailhead[] = [];
            this.table.push(line);
            const strDigits = rawLine.trim().split("");
            for (const strDigit of strDigits) {
                line.push(this.createCell(strDigit));
            }
        }

        this.width = this.table[0].length;
        this.height = this.table.length;
    }

    createCell(strDigit: string) {
        return {
            height: parseInt(strDigit),
            trailheads: [],
        };
    }

    ///////////////////////////////////////////////////////////////////////////////

    startTrails() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.table[row][col];

                if (cell.height != 0) {
                    continue;
                }

                cell.trailheads.push(row + "~" + col);
            }
        }
    }

    continueTrails() {
        for (let height = 0; height < 9; height++) {
            this.continueTrailsFrom(height);
        }
    }

    continueTrailsFrom(targetHeight: number) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.table[row][col];

                if (cell.height != targetHeight) {
                    continue;
                }

                this.continueTrailThis(
                    targetHeight + 1,
                    cell.trailheads,
                    row - 1,
                    col,
                );
                this.continueTrailThis(
                    targetHeight + 1,
                    cell.trailheads,
                    row + 1,
                    col,
                );
                this.continueTrailThis(
                    targetHeight + 1,
                    cell.trailheads,
                    row,
                    col - 1,
                );
                this.continueTrailThis(
                    targetHeight + 1,
                    cell.trailheads,
                    row,
                    col + 1,
                );
            }
        }
    }

    continueTrailThis(
        targetHeight: number,
        trailheads: string[],
        row: number,
        col: number,
    ) {
        if (row < 0) {
            return;
        }
        if (col < 0) {
            return;
        }

        if (row == this.height) {
            return;
        }
        if (col == this.width) {
            return;
        }

        const cell = this.table[row][col];

        if (cell.height != targetHeight) {
            return;
        }

        if (this.variant === 1) {
            for (const trailhead of trailheads) {
                if (!cell.trailheads.includes(trailhead)) {
                    cell.trailheads.push(trailhead);
                }
            }
        } else {
            for (const trailhead of trailheads) {
                cell.trailheads.push(trailhead + "|" + row + "~" + col);
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////

    countScores() {
        let scores = 0;

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.table[row][col];

                if (cell.height == 9) {
                    scores += cell.trailheads.length;
                }
            }
        }

        return scores;
    }

    countRatings() {
        let ratings = 0;

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.table[row][col];

                if (cell.height == 9) {
                    ratings += cell.trailheads.length;
                }
            }
        }

        return ratings;
    }

    get result() {
        if (this.variant === 1) {
            return this.countScores();
        } else {
            return this.countRatings();
        }

        return 1;
    }
}

const part1 = (rawInput: string) => {
    const puzzleSolver = new PuzzleSolver(rawInput);
    return puzzleSolver.result;
};

const part2 = (rawInput: string) => {
    const puzzleSolver = new PuzzleSolver(rawInput, 2);
    return puzzleSolver.result;
};

run({
    part1: {
        tests: [
            {
                input: `0123
1234
8765
9876`,
                expected: 1,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // {
            //   input: ``,
            //   expected: "",
            // },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
