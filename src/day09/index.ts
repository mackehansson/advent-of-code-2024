import run from "aocrunner";
import { getInputAsArray } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.trim();

type PFile = {
    id: number;
    start: number;
    size: number;
};

class ChecksumProcessor {
    public disk: number[];
    public input: string;
    public allFiles: PFile[];
    public searchStartBySpaceSize: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
    };

    constructor(input: string, puzzle: number = 1) {
        this.disk = [];
        this.allFiles = [];
        this.input = input;

        if (puzzle == 1) {
            this.processPuzzle1Input();
            this.movePuzzle1Files();
        } else {
            this.processPuzzle2Input();
            this.movePuzzle2Files();
        }
    }

    // Puzzle 1
    public processPuzzle1Input() {
        let index = -1;
        let fileId = -1;

        while (true) {
            index += 1;
            const fileLength = this.input[index];

            if (fileLength == undefined) return;
            fileId += 1;

            for (let n = 0; n < parseInt(fileLength); n++) {
                this.disk.push(fileId);
            }

            index += 1;

            const blankLength = this.input[index];
            if (blankLength == undefined) return;

            const emptySpaces = parseInt(blankLength, 10);
            if (isNaN(emptySpaces)) return;

            for (let n = 0; n < emptySpaces; n++) {
                this.disk.push(-1);
            }
        }
    }

    public movePuzzle1Files() {
        let leftIndex = -1;
        let rightIndex = this.disk.length;

        while (true) {
            while (true) {
                leftIndex += 1;
                if (leftIndex == this.disk.length || leftIndex >= rightIndex) {
                    return;
                }

                if (this.disk[leftIndex] == -1) break;
            }

            while (true) {
                rightIndex -= 1;
                if (rightIndex == -1 || rightIndex <= leftIndex) {
                    return;
                }

                if (this.disk[rightIndex] != -1) break;
            }

            this.disk[leftIndex] = this.disk[rightIndex];
            this.disk[rightIndex] = -1;
        }
    }

    // Puzzle 2
    public processPuzzle2Input() {
        let index = -1;
        let fileId = -1;

        while (true) {
            index += 1;
            const fileLength = this.input[index];

            if (fileLength == undefined) {
                return;
            }

            fileId += 1;

            this.allFiles.push({
                id: fileId,
                start: this.disk.length,
                size: parseInt(fileLength),
            });

            for (let n = 0; n < parseInt(fileLength); n++) {
                this.disk.push(fileId);
            }

            index += 1;
            const blankLength = this.input[index];
            if (blankLength == undefined) {
                return;
            }

            const emptySpaces = parseInt(blankLength, 10);
            if (isNaN(emptySpaces)) return;

            for (let n = 0; n < emptySpaces; n++) {
                this.disk.push(-1);
            }
        }
    }

    public movePuzzle2Files() {
        while (true) {
            const file = this.allFiles.pop();
            if (file == undefined) {
                return;
            }
            this.movePuzzle2File(file);
        }
    }

    public movePuzzle2File(file: PFile) {
        const spaceStart = this.findSpaceFor(file.size);
        if (spaceStart == -1) {
            return;
        }

        if (spaceStart > file.start) {
            return;
        }

        this.searchStartBySpaceSize[file.size] = spaceStart; // that was the leftmost space

        for (let n = 0; n < file.size; n++) {
            this.disk[file.start + n] = -1;
            this.disk[spaceStart + n] = file.id;
        }
    }

    public findSpaceFor(fileSize: number) {
        let afterThis = this.searchStartBySpaceSize[fileSize] - 1;
        while (true) {
            const space = this.findNextSpace(afterThis);
            if (space == null) {
                return -1;
            }
            const spaceSize = space.end - space.start + 1;
            if (spaceSize >= fileSize) {
                return space.start;
            }
            afterThis = space.end;
        }
    }

    public findNextSpace(afterThis: number) {
        let start = afterThis;

        while (true) {
            start += 1;

            const slot = this.disk[start];

            if (slot == undefined) {
                return null;
            }

            if (slot == -1) {
                break;
            }
        }

        let end = start;

        while (true) {
            if (this.disk[end + 1] != -1) {
                return { start: start, end: end };
            }

            end += 1;
        }
    }

    public get total() {
        let result = 0;

        for (let i = 0; i < this.disk.length; i++) {
            const file = this.disk[i];
            if (file !== -1) {
                result += i * file;
            }
        }

        return result;
    }
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const checksumProcessor = new ChecksumProcessor(input);
    return checksumProcessor.total;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const checksumProcessor = new ChecksumProcessor(input, 2);
    return checksumProcessor.total;
};

run({
    part1: {
        tests: [
            {
                input: `2333133121414131402`,
                expected: 1928,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `2333133121414131402`,
                expected: 2858,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
