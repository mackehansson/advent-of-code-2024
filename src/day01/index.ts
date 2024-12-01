import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput;

function splittedNumber(i: string) {
    return i
        .trim()
        .split(" ")
        .filter((i) => i !== "")
        .map(Number);
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput).split("\n");
    const listA = input.map((i) => splittedNumber(i)[0]).sort();
    const listB = input.map((i) => splittedNumber(i)[1]).sort();

    return input.reduce((acc, curr, i) => {
        const listAValue = listA[i];
        const listBValue = listB[i];
        return acc + Math.abs(listAValue - listBValue);
    }, 0);
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput).split("\n");
    const listA = input.map((i) => splittedNumber(i)[0]).sort();
    const listB = input.map((i) => splittedNumber(i)[1]).sort();

    return listA.reduce((acc, curr) => {
        const valueInB = listB.filter((i) => i === curr);
        return acc + curr * valueInB.length;
    }, 0);
};

run({
    part1: {
        tests: [
            {
                input: `
        3   4
4   3
2   5
1   3
3   9
3   3`,
                expected: 11,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
        3   4
4   3
2   5
1   3
3   9
3   3`,
                expected: 31,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
