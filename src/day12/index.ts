import run from "aocrunner";
import { getInputAsArray, PuzzleHelpers } from "../utils/index.js";

/**
 * Types
 */
type Input = string;
type Point = { x: number; y: number };
type Grid<T> = T[][];
type Direction = "N" | "S" | "E" | "W";

/**
 * Input Parser
 */
const parseInput = (rawInput: string) => rawInput;
const getInput = (rawInput: string) => {
    const inputAsArray = getInputAsArray(rawInput);
    const inputAsGrid = inputAsArray.map((line) => line.split(""));
    const inputAsNumbers = inputAsArray.map(Number);

    return {
        raw: rawInput,
        lines: inputAsArray,
        grid: inputAsGrid,
        numbers: inputAsNumbers,
    };
};

/**
 * Helper Functions
 */
class PuzzleBase extends PuzzleHelpers {
    constructor() {
        super(true);
    }
}

/**
 * Part 1 Solution
 */
class Part1Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;

    garden: string[] = [];
    processed: boolean[][] = [];

    width: number = 0;
    height: number = 0;

    currentSymbol: string = "";
    areaSize: number = 0;
    areaPerimeter: number = 0;

    result: number = 0;

    constructor(input: Input) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
    }

    processInput() {
        const lines = this.input.split("\n");
        for (const line of lines) {
            this.garden.push(line.trim());
        }
        this.height = this.garden.length;
        this.width = this.garden[0].length;

        for (const line of this.garden) {
            const doneLine: boolean[] = [];
            this.processed.push(doneLine);
            for (const symbol of line) {
                doneLine.push(false);
            }
        }
    }

    processPlot(row: number, col: number) {
        if (this.processed[row][col]) {
            return;
        }

        this.processed[row][col] = true;

        this.currentSymbol = this.garden[row][col];

        this.areaSize = 0;
        this.areaPerimeter = 0;

        this.walkFrom(row, col);

        this.result += this.areaSize * this.areaPerimeter;
    }

    walkFrom(row: number, col: number) {
        const pointsToWalk = [this.createPoint(row, col)];

        while (true) {
            const point = pointsToWalk.pop();
            if (point == undefined) {
                return;
            }
            this.areaSize += 1;
            const row = point.row;
            const col = point.col;
            this.tryCatchNeighbor(row - 1, col, pointsToWalk);
            this.tryCatchNeighbor(row + 1, col, pointsToWalk);
            this.tryCatchNeighbor(row, col + 1, pointsToWalk);
            this.tryCatchNeighbor(row, col - 1, pointsToWalk);
        }
    }

    tryCatchNeighbor(
        row: number,
        col: number,
        pointsToWalk: {
            row: number;
            col: number;
        }[],
    ) {
        if (row < 0) {
            this.areaPerimeter += 1;
            return;
        }
        if (col < 0) {
            this.areaPerimeter += 1;
            return;
        }
        if (row == this.height) {
            this.areaPerimeter += 1;
            return;
        }
        if (col == this.width) {
            this.areaPerimeter += 1;
            return;
        }

        if (this.garden[row][col] != this.currentSymbol) {
            this.areaPerimeter += 1;
            return;
        }

        if (this.processed[row][col]) {
            return;
        }

        this.processed[row][col] = true;

        pointsToWalk.push(this.createPoint(row, col));
    }

    createPoint(row: number, col: number) {
        return { row: row, col: col };
    }

    solve() {
        this.processInput();

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.processPlot(row, col);
            }
        }

        console.log("this.result:", this.result);
        return this.result;
    }
}

const part1 = (rawInput: string) => {
    const inputAsArray = getInputAsArray(rawInput);
    const inputAsString = parseInput(rawInput);
    ///////////////////////////////////////////////
    const puzzle1 = new Part1Solver(rawInput);
    return puzzle1.solve();
};

/**
 * Part 2 Solution
 */
class Part2Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;
    garden: string[] = [];
    processed: boolean[][] = [];

    width: number = 0;
    height: number = 0;

    currentSymbol: string = "";
    areaSize: number = 0;
    topBorderPlots: any = {}; // by row
    bottomBorderPlots: any = {}; // by row
    leftBorderPlots: any = {}; // by col
    rightBorderPlots: any = {}; // by col

    result: number = 0;

    constructor(input: Input) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
    }

    processInput() {
        const lines = this.input.split("\n");

        for (const line of lines) {
            this.garden.push(line.trim());
        }

        this.height = this.garden.length;
        this.width = this.garden[0].length;

        for (const line of this.garden) {
            const doneLine: boolean[] = [];
            this.processed.push(doneLine);

            for (const symbol of line) {
                doneLine.push(false);
            }
        }
    }

    processPlot(row: number, col: number) {
        if (this.processed[row][col]) {
            return;
        }

        this.processed[row][col] = true;

        this.currentSymbol = this.garden[row][col];

        this.areaSize = 0;
        this.topBorderPlots = {};
        this.bottomBorderPlots = {};
        this.leftBorderPlots = {};
        this.rightBorderPlots = {};

        this.walkFrom(row, col);

        this.result += this.areaSize * this.findNumberOfSides();
    }

    walkFrom(row: number, col: number) {
        const pointsToWalk = [this.createPoint(row, col)];

        while (true) {
            const point = pointsToWalk.pop();

            if (point == undefined) {
                return;
            }

            this.areaSize += 1;

            const row = point.row;
            const col = point.col;

            this.tryCatchNeighbor(row, col, -1, 0, pointsToWalk);
            this.tryCatchNeighbor(row, col, +1, 0, pointsToWalk);
            this.tryCatchNeighbor(row, col, 0, -1, pointsToWalk);
            this.tryCatchNeighbor(row, col, 0, +1, pointsToWalk);
        }
    }

    tryCatchNeighbor(
        baseRow: number,
        baseCol: number,
        deltaRow: number,
        deltaCol: number,
        pointsToWalk: {
            row: any;
            col: any;
        }[],
    ) {
        const neighborRow = baseRow + deltaRow;
        const neighborCol = baseCol + deltaCol;

        if (neighborRow < 0) {
            this.pushToTopBorderPlots(baseRow, baseCol);
            return;
        }
        if (neighborCol < 0) {
            this.pushToLeftBorderPlots(baseRow, baseCol);
            return;
        }

        if (neighborRow == this.height) {
            this.pushToBottomBorderPlots(baseRow, baseCol);
            return;
        }
        if (neighborCol == this.width) {
            this.pushToRightBorderPlots(baseRow, baseCol);
            return;
        }

        if (this.garden[neighborRow][neighborCol] != this.currentSymbol) {
            if (neighborRow < baseRow) {
                this.pushToTopBorderPlots(baseRow, baseCol);
                return;
            }
            if (neighborCol < baseCol) {
                this.pushToLeftBorderPlots(baseRow, baseCol);
                return;
            }

            if (neighborRow > baseRow) {
                this.pushToBottomBorderPlots(baseRow, baseCol);
                return;
            }
            if (neighborCol > baseCol) {
                this.pushToRightBorderPlots(baseRow, baseCol);
                return;
            }
        }

        if (this.processed[neighborRow][neighborCol]) {
            return;
        }

        this.processed[neighborRow][neighborCol] = true;

        pointsToWalk.push(this.createPoint(neighborRow, neighborCol));
    }

    createPoint(row: number, col: number) {
        return { row: row, col: col };
    }

    pushToTopBorderPlots(row: number, col: number) {
        if (this.topBorderPlots[row] == undefined) {
            this.topBorderPlots[row] = [];
        }

        this.topBorderPlots[row].push(col);
    }

    pushToBottomBorderPlots(row: number, col: number) {
        if (this.bottomBorderPlots[row] == undefined) {
            this.bottomBorderPlots[row] = [];
        }

        this.bottomBorderPlots[row].push(col);
    }

    pushToLeftBorderPlots(row: number, col: number) {
        if (this.leftBorderPlots[col] == undefined) {
            this.leftBorderPlots[col] = [];
        }

        this.leftBorderPlots[col].push(row);
    }

    pushToRightBorderPlots(row: number, col: number) {
        if (this.rightBorderPlots[col] == undefined) {
            this.rightBorderPlots[col] = [];
        }

        this.rightBorderPlots[col].push(row);
    }

    findNumberOfSides() {
        let sides = 0;

        for (const dict of [
            this.topBorderPlots,
            this.bottomBorderPlots,
            this.leftBorderPlots,
            this.rightBorderPlots,
        ]) {
            sides += this.findNumberOfSidesThis(dict);
        }
        return sides;
    }

    findNumberOfSidesThis(dict: any) {
        let sides = 0;

        for (const list of Object.values(dict)) {
            sides += this.findNumberOfSidesThisList(list);
        }
        return sides;
    }

    findNumberOfSidesThisList(list: any) {
        list.sort(function (a, b) {
            return a - b;
        });

        const newList = [];

        while (true) {
            const candidate = list.shift();
            if (candidate == undefined) {
                break;
            }

            const previous = newList.at(-1);

            if (previous == undefined) {
                newList.push(candidate);
                continue;
            }

            if (candidate - previous == 1) {
                newList.pop();
            } // removing neighbor on same same side

            newList.push(candidate);
        }

        return newList.length;
    }

    solve() {
        this.processInput();

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.processPlot(row, col);
            }
        }

        return this.result;
    }
}

const part2 = (rawInput: string) => {
    const inputAsArray = getInputAsArray(rawInput);
    const inputAsString = parseInput(rawInput);
    ///////////////////////////////////////////////
    const puzzle2 = new Part2Solver(rawInput);
    return puzzle2.solve();
};

run({
    part1: {
        tests: [
            {
                input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
                expected: 1930,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
                expected: 368,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
