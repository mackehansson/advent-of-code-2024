/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

type Point = { x: number; y: number };
type Grid<T> = T[][];
type Direction = "N" | "S" | "E" | "W";

export function getInputAsArray(input: string): string[] {
    return input.split(/\s+/);
}

export const basicDirections = {
    up: [-1, 0], // row-1, col+0
    down: [1, 0], // row+1, col+0
    left: [0, -1], // row+0, col-1
    right: [0, 1], // row+0, col+1
} as const;

export const directions = {
    up: [-1, 0], // row-1, col+0
    down: [1, 0], // row+1, col+0
    left: [0, -1], // row+0, col-1
    right: [0, 1], // row+0, col+1
    // Diagonals if needed:
    upLeft: [-1, -1],
    upRight: [-1, 1],
    downLeft: [1, -1],
    downRight: [1, 1],
} as const;

export function getDirections(withDiagonals: boolean) {
    if (withDiagonals) return directions;
    return basicDirections;
}

export class PuzzleHelpers {
    protected debug: boolean = false;

    constructor(debug: boolean = false) {
        this.debug = debug;
    }

    protected log(...args: any[]) {
        if (this.debug) console.log(...args);
    }

    protected createGrid<T>(
        rows: number,
        cols: number,
        defaultValue: T,
    ): Grid<T> {
        return Array(rows)
            .fill(null)
            .map(() => Array(cols).fill(defaultValue));
    }

    protected manhattanDistance(p1: Point, p2: Point): number {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    protected findInGrid<T>(
        grid: Grid<T>,
        predicate: (value: T) => boolean,
    ): Point[] {
        const points: Point[] = [];
        grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (predicate(value)) points.push({ x, y });
            });
        });
        return points;
    }

    protected memoize<T extends (...args: any[]) => any>(fn: T): T {
        const cache = new Map();
        return ((...args: any[]) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) return cache.get(key);
            const result = fn(...args);
            cache.set(key, result);
            return result;
        }) as T;
    }

    // 2D Array Operations
    protected rotate2DArray<T>(matrix: T[][]): T[][] {
        return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
    }

    protected transpose2DArray<T>(matrix: T[][]): T[][] {
        return matrix[0].map((_, i) => matrix.map((row) => row[i]));
    }

    protected flipHorizontal<T>(matrix: T[][]): T[][] {
        return matrix.map((row) => [...row].reverse());
    }

    protected flipVertical<T>(matrix: T[][]): T[][] {
        return [...matrix].reverse();
    }

    // Array Helpers
    protected sum(arr: number[]): number {
        return arr.reduce((a, b) => a + b, 0);
    }

    protected product(arr: number[]): number {
        return arr.reduce((a, b) => a * b, 1);
    }

    protected min(arr: number[]): number {
        return Math.min(...arr);
    }

    protected max(arr: number[]): number {
        return Math.max(...arr);
    }

    // Grid Navigation
    protected getAdjacentCoords(
        row: number,
        col: number,
        includeDiagonals = false,
    ): [number, number][] {
        const directions = includeDiagonals
            ? [
                  [-1, -1],
                  [-1, 0],
                  [-1, 1],
                  [0, -1],
                  [0, 1],
                  [1, -1],
                  [1, 0],
                  [1, 1],
              ]
            : [
                  [-1, 0],
                  [0, -1],
                  [0, 1],
                  [1, 0],
              ];

        return directions.map(([dx, dy]) => [row + dx, col + dy]);
    }

    protected isInBounds(row: number, col: number, grid: any[][]): boolean {
        return (
            row >= 0 && row < grid.length && col >= 0 && col < grid[0].length
        );
    }

    // Set Operations
    protected intersection<T>(arrays: T[][]): T[] {
        return arrays.reduce((a, b) => a.filter((c) => b.includes(c)));
    }

    protected unique<T>(arr: T[]): T[] {
        return [...new Set(arr)];
    }

    // String Operations
    protected countChars(str: string): Map<string, number> {
        return str.split("").reduce((map, char) => {
            map.set(char, (map.get(char) || 0) + 1);
            return map;
        }, new Map<string, number>());
    }

    protected chunks<T>(arr: T[], size: number): T[][] {
        return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size),
        );
    }

    // Number Operations
    protected gcd(a: number, b: number): number {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    protected lcm(a: number, b: number): number {
        return Math.abs(a * b) / this.gcd(a, b);
    }
}
