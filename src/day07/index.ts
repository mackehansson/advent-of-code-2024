import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput;

const ADD = "+";
const MULTIPLY = "*";
const OR = "||";

function findValidExpression(
    expression: string,
    expectedResult: number,
): boolean {
    const numbers = expression.split(" ").map(Number);
    const operatorCombinations = generateOperatorCombinations(
        numbers.length - 1,
    );

    return operatorCombinations.some((operators) => {
        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            const operator = operators[i];
            const nextNumber = numbers[i + 1];

            if (operator === OR) {
                result = combineNumbers(result, nextNumber);
            } else {
                result =
                    operator === ADD
                        ? result + nextNumber
                        : result * nextNumber;
            }
        }
        return result === expectedResult;
    });
}

function combineNumbers(a: number, b: number): number {
    return parseInt(`${a}${b}`);
}

function generateOperatorCombinations(length: number): string[][] {
    const operators = [ADD, MULTIPLY, OR];
    const combinations: string[][] = [];

    function generate(current: string[]) {
        if (current.length === length) {
            combinations.push([...current]);
            return;
        }

        for (const op of operators) {
            current.push(op);
            generate(current);
            current.pop();
        }
    }

    generate([]);
    return combinations;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput)
        .split("\n")
        .map((line) => line.split(": "));

    return input.reduce((acc, line) => {
        const testValue = parseInt(line[0]);
        const equationRaw = line[1];

        if (findValidExpression(equationRaw, testValue)) {
            return acc + testValue;
        }

        return acc;
    }, 0);
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput)
        .split("\n")
        .map((line) => line.split(": "));

    return input.reduce((acc, line) => {
        const testValue = parseInt(line[0]);
        const equationRaw = line[1];

        if (findValidExpression(equationRaw, testValue)) {
            return acc + testValue;
        }

        return acc;
    }, 0);
};

run({
    part1: {
        tests: [
            {
                input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
                expected: 3749,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
                expected: 11387,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
