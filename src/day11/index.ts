import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";
const parseInput = (rawInput: string) => rawInput;
import { Day2Solver } from "./day2solver.js";

class PuzzleProcessor {
    input: number[];
    turns: number;

    constructor(rawInput: string, turns: number = 25) {
        this.input = getInputAsArray(rawInput).map(Number);
        this.turns = turns;
    }

    isEvenAmountOfNumbers(num: number) {
        return num.toString().length % 2 === 0;
    }

    splitStringInHalf(num: number) {
        const numAsString = num.toString();
        const half = Math.floor(numAsString.length / 2);
        const firstHalf = parseInt(numAsString.slice(0, half), 10).toString();
        const secondHalf = parseInt(numAsString.slice(half), 10).toString();

        return [parseInt(firstHalf), parseInt(secondHalf)];
    }

    playRound(input: number[]) {
        const returnStones = [];

        for (let i = 0; i < input.length; i++) {
            const currentStone = input[i];

            if (currentStone === 0) {
                returnStones.push(1);
                continue;
            }

            if (this.isEvenAmountOfNumbers(currentStone)) {
                const splittedStones = this.splitStringInHalf(currentStone);
                returnStones.push(...splittedStones);
                continue;
            }

            returnStones.push(currentStone * 2024);
        }

        return returnStones;
    }

    playGame(blinks: number, initialStones: number[]) {
        let currentStones = initialStones;

        for (let i = 0; i < blinks; i++) {
            currentStones = this.playRound(currentStones);
        }

        return currentStones.length;
    }

    get puzzle1result() {
        return this.playGame(this.turns, this.input);
    }
}

const part1 = (rawInput: string) => {
    const puzzle1 = new PuzzleProcessor(rawInput);
    return puzzle1.puzzle1result;
};

const part2 = (rawInput: string) => {
    const puzzle2 = new Day2Solver(rawInput);
    // const puzzle1 = new PuzzleProcessor(rawInput);
    return puzzle2.main();
};

run({
    part1: {
        tests: [
            {
                input: `125 17`,
                expected: 55312,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `125 17`,
                expected: 55312,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
