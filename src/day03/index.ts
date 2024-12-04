import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;
const matchInput = (input: string) => input.match(/mul\(\d+,\d+\)/g) ?? [];
const getNumbers = (input: string) =>
    input.replace("mul(", "").replace(")", "").split(",").map(Number);
const getCalculateNumbers = (input: string) => {
    return matchInput(input).reduce((acc, curr) => {
        const resultNumbers = getNumbers(curr);
        return acc + resultNumbers[0] * resultNumbers[1];
    }, 0);
};

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const result = getCalculateNumbers(input);
    return result;
};

const part2 = (rawInput: string) => {
    const input = "do()" + parseInput(rawInput);
    const regex = /(do\(\)|don't\(\))[^d]*/g;
    const groups = input.match(regex) ?? [];

    const doInstruction = "do()";
    return groups.reduce((acc, group) => {
        if (group.startsWith(doInstruction)) {
            const result = getCalculateNumbers(group);
            return acc + result;
        }

        return acc;
    }, 0);
};

run({
    part1: {
        tests: [
            {
                input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
                expected: 161,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
                expected: 48,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
