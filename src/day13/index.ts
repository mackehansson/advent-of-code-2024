import run from "aocrunner";
import { getInputAsArray, PuzzleHelpers } from "../utils/index.js";

/**
 * Types
 */
type Input = string;
type Point = { x: number; y: number };
type Grid<T> = T[][];
type Direction = "N" | "S" | "E" | "W";

type Configuration = {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    targetX: number;
    targetY: number;
};

/**
 * Input Parser
 */
const parseInput = (rawInput: string) => rawInput;
const getInput = (rawInput: string) => {
    const split = rawInput.split("\n");
    const inputAsArray = getInputAsArray(rawInput);
    const inputAsGrid = inputAsArray.map((line) => line.split(""));
    const inputAsNumbers = inputAsArray.map(Number);

    return {
        splitted: split,
        raw: rawInput.replace(/\r\n/g, "\n"),
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

    findCombinations({
        ax,
        ay,
        bx,
        by,
        targetX,
        targetY,
    }: Configuration): [number, number][] {
        const results: [number, number][] = [];

        // Find the maximum possible value for n
        const maxN = Math.min(
            Math.floor(targetX / ax),
            Math.floor(targetY / ay),
        );

        for (let n = 0; n <= maxN; n++) {
            const remainderX = targetX - n * ax;
            const remainderY = targetY - n * ay;

            // Check if both remainders are divisible by their respective b values
            if (
                remainderX >= 0 &&
                remainderY >= 0 &&
                remainderX % bx === 0 &&
                remainderY % by === 0
            ) {
                const mx = remainderX / bx;
                const my = remainderY / by;

                // Only add if both equations are satisfied with same m value
                if (mx === my) {
                    results.push([n, mx]);
                }
            }
        }

        return results;
    }

    parseCoordinates(arr: string[]): number[] {
        return arr.map((str) => {
            const match = str.match(/[+-]?\d+/);
            return match ? parseInt(match[0]) : 0;
        });
    }

    allConfigurations(input: string) {
        const lines = input.split("\n\n");
        const configurations: Configuration[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].split("\n");

            const [ax, ay] = this.parseCoordinates(
                line[0]
                    .split(" ")
                    .filter(
                        (str) =>
                            str.toLowerCase().includes("x") ||
                            str.toLowerCase().includes("y"),
                    ),
            );

            const [bx, by] = this.parseCoordinates(
                line[1]
                    .split(" ")
                    .filter(
                        (str) =>
                            str.toLowerCase().includes("x") ||
                            str.toLowerCase().includes("y"),
                    ),
            );

            const [targetX, targetY] = this.parseCoordinates(
                line[2]
                    .split(" ")
                    .filter(
                        (str) =>
                            str.toLowerCase().includes("x") ||
                            str.toLowerCase().includes("y"),
                    ),
            );

            configurations.push({ ax, bx, ay, by, targetX, targetY });
        }

        return configurations;
    }

    calculateTokenCost(combinations: [number, number][]) {
        return combinations.reduce((acc, [n, m]) => acc + n * 3 + m, 0);
    }
}

/**
 * Part 1 Solution
 */
class Part1Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;
    configurations: Configuration[] = [];

    constructor(input: Input) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
    }

    solve() {
        const allConfigurations = this.allConfigurations(this.parsedInput.raw);
        const result = allConfigurations.reduce((acc, config) => {
            const combinations = this.findCombinations(config);

            if (combinations.length > 0) {
                const tokenCost = this.calculateTokenCost(combinations);
                return acc + tokenCost;
            }

            return acc;
        }, 0);

        return result;
    }
}

const part1 = (rawInput: string) => {
    const puzzle1 = new Part1Solver(rawInput);
    return puzzle1.solve();
};

/**
 * Part 2 Solution
 */
class Part2Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;
    configurations: Configuration[] = [];
    minimumSpentTokens: number = 0;
    OFFSET: number = 10 * 1000 * 1000 * 1000 * 1000;

    constructor(input: Input) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
    }

    processMachine({ ax, ay, bx, by, targetX, targetY }: Configuration) {
        const aClicksXMultiplier = ax * by;
        const aClicksYMultiplier = -(ay * bx);
        const prizeXMultiplied = targetX * by;
        const prizeYMultiplied = -(targetY * bx);

        const aClicksMultiplierCombined =
            aClicksXMultiplier + aClicksYMultiplier;
        const prizeMultipliedCombined = prizeXMultiplied + prizeYMultiplied;

        const aClicks = prizeMultipliedCombined / aClicksMultiplierCombined;

        if (prizeMultipliedCombined % aClicksMultiplierCombined != 0) {
            return;
        } // has no solution

        const bClicks = (targetX - ax * aClicks) / bx;

        if (bClicks != Math.floor(bClicks)) {
            return;
        } // has no solution

        this.minimumSpentTokens += aClicks * 3 + bClicks;

        return aClicks * 3 + bClicks;
    }

    solve() {
        const allConfigurations = this.allConfigurations(this.parsedInput.raw);

        const result = allConfigurations.reduce((acc, config) => {
            const { ax, ay, bx, by, targetX, targetY } = config;
            const r = this.processMachine({
                ax,
                ay,
                bx,
                by,
                targetX: this.OFFSET + targetX,
                targetY: this.OFFSET + targetY,
            });

            if (r) {
                return acc + r;
            }

            return acc;
        }, 0);

        return result;
    }
}

const part2 = (rawInput: string) => {
    const puzzle2 = new Part2Solver(rawInput);
    return puzzle2.solve();
};

run({
    part1: {
        tests: [
            {
                input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
                expected: 480,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
                expected: 480,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
