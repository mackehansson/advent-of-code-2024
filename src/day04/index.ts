import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";

type Direction = { dx: number; dy: number };
type Grid = string[];
type Position = { row: number; col: number };

const part1 = (rawInput: string) => {
    const input = getInputAsArray(rawInput);

    function findXMAS(grid: Grid): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;

        const directions: Direction[] = [
            { dx: 0, dy: 1 }, // right
            { dx: 1, dy: 0 }, // down
            { dx: 1, dy: 1 }, // diagonal right-down
            { dx: 1, dy: -1 }, // diagonal left-down
            { dx: 0, dy: -1 }, // left
            { dx: -1, dy: 0 }, // up
            { dx: -1, dy: 1 }, // diagonal right-up
            { dx: -1, dy: -1 }, // diagonal left-up
        ];

        const isInBounds = (row: number, col: number, dx: number, dy: number) =>
            row + 3 * dx >= 0 &&
            row + 3 * dx < rows &&
            col + 3 * dy >= 0 &&
            col + 3 * dy < cols;

        const checkDirection = (row: number, col: number, dir: Direction) => {
            const { dx, dy } = dir;
            if (!isInBounds(row, col, dx, dy)) return false;

            return (
                grid[row][col] === "X" &&
                grid[row + dx][col + dy] === "M" &&
                grid[row + 2 * dx][col + 2 * dy] === "A" &&
                grid[row + 3 * dx][col + 3 * dy] === "S"
            );
        };

        let count = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                count += directions.filter((dir) =>
                    checkDirection(i, j, dir),
                ).length;
            }
        }
        return count;
    }

    return findXMAS(input);
};

const part2 = (rawInput: string) => {
    const input = getInputAsArray(rawInput);

    function findXMAS(grid: Grid): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;

        const isInBounds = (pos: Position, dr: number, dc: number) =>
            pos.row + 2 * dr >= 0 &&
            pos.row + 2 * dr < rows &&
            pos.col + 2 * dc >= 0 &&
            pos.col + 2 * dc < cols;

        const checkMAS = (pos: Position, dr: number, dc: number): boolean => {
            if (!isInBounds(pos, dr, dc)) return false;

            const { row, col } = pos;
            return (
                (grid[row][col] === "M" &&
                    grid[row + dr][col + dc] === "A" &&
                    grid[row + 2 * dr][col + 2 * dc] === "S") ||
                (grid[row][col] === "S" &&
                    grid[row + dr][col + dc] === "A" &&
                    grid[row + 2 * dr][col + 2 * dc] === "M")
            );
        };

        const checkXPattern = (row: number, col: number): boolean =>
            checkMAS({ row, col }, 1, 1) && // diagonal down-right
            checkMAS({ row, col: col + 2 }, 1, -1); // diagonal down-left

        let count = 0;
        for (let i = 0; i < rows - 2; i++) {
            for (let j = 0; j < cols - 2; j++) {
                if (checkXPattern(i, j)) count++;
            }
        }
        return count;
    }

    return findXMAS(input);
};

run({
    part1: {
        tests: [
            {
                input: `
              MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
                expected: 18,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
              MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
                expected: 9,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
