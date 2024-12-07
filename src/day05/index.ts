import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";

const splittedInstructions = (arr: string[]) => {
    const result = [];
    let temp = [];
    for (const line of arr) {
        if (line === "") {
            result.push(temp);
            temp = [];
        } else {
            temp.push(line);
        }
    }
    result.push(temp);
    return result;
};

function getMiddleNumber(arr: number[]): number {
    const middleIndex = Math.floor(arr.length / 2);
    return arr[middleIndex];
}

function sortInstruction(rules: string[], instruction: number[]): number[] {
    // Build adjacency list
    const graph = new Map<number, Set<number>>();
    const inDegree = new Map<number, number>();

    // Initialize maps for all numbers in instruction
    instruction.forEach((num) => {
        graph.set(num, new Set());
        inDegree.set(num, 0);
    });

    // Build the graph
    for (const rule of rules) {
        const [before, after] = rule.split("|").map(Number);
        if (instruction.includes(before) && instruction.includes(after)) {
            graph.get(before)?.add(after);
            inDegree.set(after, (inDegree.get(after) || 0) + 1);
        }
    }

    // Topological sort
    const queue: number[] = [];
    const result: number[] = [];

    // Start with nodes that have no dependencies
    instruction.forEach((num) => {
        if (inDegree.get(num) === 0) queue.push(num);
    });

    while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current);

        for (const neighbor of graph.get(current) || []) {
            inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    return result;
}

function isValidOrder(rules: string[], instruction: number[]): boolean {
    const mustComeBefore = new Map<number, Set<number>>();
    const mustComeAfter = new Map<number, Set<number>>();

    // Initialize maps
    for (const rule of rules) {
        const [before, after] = rule.split("|").map(Number);
        if (!mustComeBefore.has(before)) mustComeBefore.set(before, new Set());
        if (!mustComeAfter.has(after)) mustComeAfter.set(after, new Set());
        mustComeBefore.get(before)?.add(after);
        mustComeAfter.get(after)?.add(before);
    }

    // Check each position
    for (let i = 0; i < instruction.length; i++) {
        const current = instruction[i];
        const before = instruction.slice(0, i);
        const after = instruction.slice(i + 1);

        // Filter required numbers to only those in instruction
        const requiredBefore = new Set(
            [...(mustComeAfter.get(current) || new Set())].filter((num) =>
                instruction.includes(num),
            ),
        );

        if ([...requiredBefore].some((num) => !before.includes(num))) {
            return false;
        }

        const requiredAfter = new Set(
            [...(mustComeBefore.get(current) || new Set())].filter((num) =>
                instruction.includes(num),
            ),
        );

        if ([...requiredAfter].some((num) => !after.includes(num))) {
            return false;
        }
    }

    return true;
}

const parseInput = (rawInput: string) => rawInput.replace(/\r\n/g, "\n");

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput).split("\n");
    const splitInput = splittedInstructions(input);
    const updates = splitInput[1];

    const result = updates.reduce((acc, updateStr) => {
        const update = updateStr.split(",").map(Number);
        if (isValidOrder(splitInput[0], update)) {
            return acc + getMiddleNumber(update);
        }

        return acc;
    }, 0);

    return result;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput).split("\n");
    const splitInput = splittedInstructions(input);
    const updates = splitInput[1];

    const result = updates.reduce((acc, updateStr) => {
        const update = updateStr.split(",").map(Number);
        if (isValidOrder(splitInput[0], update)) {
            return acc;
        }

        const sortedUpdate = sortInstruction(splitInput[0], update);
        if (isValidOrder(splitInput[0], sortedUpdate)) {
            return acc + getMiddleNumber(sortedUpdate);
        }

        return acc;
    }, 0);

    return result;
};

run({
    part1: {
        tests: [
            {
                input: `
              47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
                expected: 143,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
              47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
                expected: 123,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
