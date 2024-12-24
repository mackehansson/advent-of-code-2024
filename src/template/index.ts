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
        super();
    }
}

/**
 * Part 1 Solution
 */
class Part1Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;

    constructor(input: Input) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
    }

    solve() {
        this.log("Solving part 1...");
        return;
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

    constructor(input: Input) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
    }

    solve() {
        this.log("Solving part 2...");
        return;
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
            // {
            //   input: ``,
            //   expected: "",
            // },
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
