import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";
const parseInput = (rawInput: string) => rawInput;

type Antenna = { row: number; col: number };
type Antinode = Record<string, boolean>;

class AntinodeProcessor {
    public lines: string[];
    public map: string[];
    public allAntennas: Record<string, Antenna[]>;
    public width: number;
    public height: number;
    public allAntinodes: Antinode;

    constructor(lines: string[]) {
        this.lines = lines;
        this.map = [];
        this.allAntennas = {};
        this.width = 0;
        this.height = 0;
        this.allAntinodes = {};

        this.init();
    }

    public init() {
        let row = -1;

        for (const rawLine of this.lines) {
            row += 1;
            const line = rawLine.trim();
            this.map.push(line);
            let col = -1;
            for (const symbol of line) {
                col += 1;
                if (symbol == ".") continue;
                if (this.allAntennas[symbol] == undefined)
                    this.allAntennas[symbol] = [];
                this.allAntennas[symbol].push({ row: row, col: col });
            }
        }

        this.height = this.map.length;
        this.width = this.map[0].length;
    }

    public findAntinodes(antennas: Antenna[]) {
        for (let n = 0; n < antennas.length - 1; n++) {
            for (let p = n + 1; p < antennas.length; p++) {
                const a = antennas[n];
                const b = antennas[p];

                this.findAntinodesFor(a, b);
            }
        }
    }

    public findAntinodesFor(a: Antenna, b: Antenna) {
        const deltaRow = b.row - a.row;
        const cRow = a.row - deltaRow;
        const dRow = b.row + deltaRow;

        const deltaCol = b.col - a.col;
        const cCol = a.col - deltaCol;
        const dCol = b.col + deltaCol;

        this.registerAntinode(cRow, cCol);
        this.registerAntinode(dRow, dCol);
    }

    public registerAntinode(row: number, col: number) {
        if (row < 0 || col < 0 || row >= this.height || col >= this.width)
            return;
        this.allAntinodes[row + ":" + col] = true;
    }

    public get count() {
        const symbols = Object.keys(this.allAntennas);

        for (const symbol of symbols) {
            this.findAntinodes(this.allAntennas[symbol]);
        }

        return Object.keys(this.allAntinodes).length;
    }
}

class CalculatedAntidnodeProcessor extends AntinodeProcessor {
    constructor(lines: string[]) {
        super(lines);
    }

    public registerAntinodes(
        baseRow: number,
        baseCol: number,
        deltaRow: number,
        deltaCol: number,
    ) {
        let row = baseRow;
        let col = baseCol;

        while (true) {
            this.allAntinodes[row + ":" + col] = true;
            row += deltaRow;
            col += deltaCol;

            if (row < 0 || col < 0 || row >= this.height || col >= this.width) {
                return;
            }
        }
    }

    public findAntinodesFor(a: Antenna, b: Antenna): void {
        const deltaRow = b.row - a.row;
        const deltaCol = b.col - a.col;
        this.registerAntinodes(a.row, a.col, deltaRow, deltaCol); // forward
        this.registerAntinodes(a.row, a.col, deltaRow * -1, deltaCol * -1); // backwards
    }
}

const part1 = (rawInput: string) => {
    const lines = parseInput(rawInput).split("\n");
    const antinodeProcessor = new AntinodeProcessor(lines);
    return antinodeProcessor.count;
};

const part2 = (rawInput: string) => {
    const lines = parseInput(rawInput).split("\n");
    const antinodeProcessor = new CalculatedAntidnodeProcessor(lines);
    return antinodeProcessor.count;
};

run({
    part1: {
        tests: [
            {
                input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
                expected: 14,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
                expected: 34,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
