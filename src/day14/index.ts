import run from "aocrunner";
import { getInputAsArray, PuzzleHelpers } from "../utils/index.js";

/**
 * Types
 */
type Input = string;
type Point = { x: number; y: number };
type Grid<T> = T[][];
type Direction = "N" | "S" | "E" | "W";
type Robot = {
    position: Point;
    velocity: Point;
};
type QuadrantGroups = {
    q1: Point[]; // top right
    q2: Point[]; // top left
    q3: Point[]; // bottom left
    q4: Point[]; // bottom right
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

    getRobots(input: string[]): Robot[] {
        return input.map((line) => {
            const parts = line.split(" ");
            const position = parts[0].split("=")[1].split(",");
            const velocity = parts[1].split("=")[1].split(",");
            return {
                position: { x: Number(position[0]), y: Number(position[1]) },
                velocity: { x: Number(velocity[0]), y: Number(velocity[1]) },
            };
        });
    }

    getQuadrantGroups(
        points: Point[],
        width: number,
        height: number,
    ): QuadrantGroups {
        const midX = Math.floor(width / 2); // 5
        const midY = Math.floor(height / 2); // 3

        // Filter out points on center lines
        const validPoints = points.filter((p) => p.x !== midX && p.y !== midY);

        return validPoints.reduce(
            (acc: QuadrantGroups, point) => {
                if (point.x > midX && point.y < midY) {
                    acc.q1.push(point);
                } else if (point.x < midX && point.y < midY) {
                    acc.q2.push(point);
                } else if (point.x < midX && point.y > midY) {
                    acc.q3.push(point);
                } else if (point.x > midX && point.y > midY) {
                    acc.q4.push(point);
                }
                return acc;
            },
            { q1: [], q2: [], q3: [], q4: [] },
        );
    }

    getSafetyFactor(quadrants: QuadrantGroups): number {
        const q1 = quadrants.q1.length;
        const q2 = quadrants.q2.length;
        const q3 = quadrants.q3.length;
        const q4 = quadrants.q4.length;

        return q1 * q2 * q3 * q4;
    }

    calculateNextPosition(
        current: { x: number; y: number },
        velocity: { x: number; y: number },
        width: number,
        height: number,
    ): Point {
        // First add velocity
        let newX = current.x + velocity.x;
        let newY = current.y + velocity.y;

        // Handle X wrapping
        newX = ((newX % width) + width) % width;

        // Handle Y wrapping
        if (newY < 0) {
            newY = height + (newY % height);
        } else if (newY >= height) {
            newY = newY % height;
        }

        return { x: newX, y: newY };
    }

    visualizeGrid(positions: Point[], width: number, height: number): string {
        // Create empty grid
        const grid = Array(height)
            .fill(null)
            .map(() => Array(width).fill("."));

        // Count robots at each position
        const counts = positions.reduce((acc, pos) => {
            const key = `${pos.x},${pos.y}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Plot robots with counts
        positions.forEach((pos) => {
            const count = counts[`${pos.x},${pos.y}`];
            if (grid[pos.y] && grid[pos.y][pos.x] !== undefined) {
                grid[pos.y][pos.x] = count.toString();
            }
        });

        // Convert to string
        return grid.map((row) => row.join("")).join("\n");
    }
}

/**
 * Part 1 Solution
 */
class Part1Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;
    width: number;
    height: number;

    constructor(input: Input, wdith: number, height: number) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
        this.width = wdith;
        this.height = height;
    }

    getPositionAtTime(allRobots: Robot[], seconds: number = 100): Point[] {
        return allRobots.reduce((acc, robot) => {
            let position = robot.position;
            const velocity = robot.velocity;

            for (let i = 1; i <= seconds; i++) {
                position = this.calculateNextPosition(
                    position,
                    velocity,
                    this.width,
                    this.height,
                );
            }

            return [...acc, position];
        }, [] as Point[]);
    }

    solve() {
        const allRobots = this.getRobots(this.parsedInput.splitted);
        const updatedRobots = this.getPositionAtTime(allRobots);
        const quadrants = this.getQuadrantGroups(
            updatedRobots,
            this.width,
            this.height,
        );
        const safetyFactor = this.getSafetyFactor(quadrants);

        return safetyFactor;
    }
}

const part1 = (rawInput: string) => {
    // const puzzle1 = new Part1Solver(rawInput, 101, 103);
    const puzzle1 = new Part1Solver(rawInput, 11, 7);
    return puzzle1.solve();
};

/**
 * Part 2 Solution
 */
class Part2Solver extends PuzzleBase {
    input: Input;
    parsedInput: ReturnType<typeof getInput>;
    width: number;
    height: number;

    constructor(input: Input, wdith: number, height: number) {
        super();
        this.input = input;
        this.parsedInput = getInput(input);
        this.width = wdith;
        this.height = height;
    }

    getPositionAtTime(allRobots: Robot[], seconds: number = 100): Point[] {
        return allRobots.reduce((acc, robot) => {
            let position = robot.position;
            const velocity = robot.velocity;

            for (let i = 1; i <= seconds; i++) {
                position = this.calculateNextPosition(
                    position,
                    velocity,
                    this.width,
                    this.height,
                );
            }

            return [...acc, position];
        }, [] as Point[]);
    }

    isChristmasTreePattern(positions: Point[]): boolean {
        const grid = Array(this.height)
            .fill(0)
            .map(() => Array(this.width).fill(0));

        // Count robots in each position
        positions.forEach((pos) => {
            grid[pos.y][pos.x]++;
        });

        // Get row sums from bottom to top
        const rowSums = grid
            .map((row) => row.reduce((sum, val) => sum + val, 0))
            .reverse();

        // Check if values decrease as we go up
        for (let i = 1; i < rowSums.length; i++) {
            if (rowSums[i] >= rowSums[i - 1]) {
                return false;
            }
        }

        // Check symmetry around center
        const midX = Math.floor(this.width / 2);
        return grid.every((row) => {
            const leftSum = row
                .slice(0, midX)
                .reduce((sum, val) => sum + val, 0);
            const rightSum = row
                .slice(midX + 1)
                .reduce((sum, val) => sum + val, 0);
            return Math.abs(leftSum - rightSum) <= 1;
        });
    }

    findChristmasTreeTime(allRobots: Robot[]): number {
        for (let seconds = 1; seconds <= 10000; seconds++) {
            const positions = this.getPositionAtTime(allRobots, seconds);
            if (this.isChristmasTreePattern(positions)) {
                console.log("Tree found at second:", seconds);
                console.log(
                    this.visualizeGrid(positions, this.width, this.height),
                );
                return seconds;
            }
        }
        return -1;
    }

    solve() {
        const allRobots = this.getRobots(this.parsedInput.splitted);

        const cts = this.findChristmasTreeTime(allRobots);
        console.log("cts:", cts);

        // Visualize initial state
        // console.log("Initial state:");
        // console.log(
        //     this.visualizeGrid(
        //         allRobots.map((r) => r.position),
        //         this.width,
        //         this.height,
        //     ),
        // );

        // Visualize after movement
        // const updatedRobots = this.getPositionAtTime(allRobots, 17);
        // console.log("\nAfter 1 second:");
        // console.log(this.visualizeGrid(updatedRobots, this.width, this.height));

        const updatedRobots = this.getPositionAtTime(allRobots, 0);
        const quadrants = this.getQuadrantGroups(
            updatedRobots,
            this.width,
            this.height,
        );
        const safetyFactor = this.getSafetyFactor(quadrants);

        return safetyFactor;
    }
}

const part2 = (rawInput: string) => {
    const puzzle2 = new Part2Solver(rawInput, 101, 103);
    // const puzzle2 = new Part2Solver(rawInput, 11, 7);
    return puzzle2.solve();
};

run({
    part1: {
        tests: [
            {
                input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
                expected: 12,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
                expected: 12,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
