export class Day2Solver {
    input: string;
    initialStones: any = {};
    afterFiveBlinks: any = {};

    constructor(input: string) {
        this.input = input;
    }

    main() {
        this.processInput();
        for (const stone of Object.keys(this.initialStones)) {
            this.memorizeAfterFiveBlinks(stone);
        }
        return this.search();
    }

    processInput() {
        const tokens = this.input.split(" ");
        for (const token of tokens) {
            if (this.initialStones[token] == undefined) {
                this.initialStones[token] = 0;
            }
            this.initialStones[token] += 1;
        }
    }

    primitiveBlink(srcStones: any) {
        const newStones = [];
        while (true) {
            const stone = srcStones.shift();
            if (stone == undefined) {
                break;
            }
            if (stone == "0") {
                newStones.push("1");
                continue;
            }
            if (stone.length % 2 == 0) {
                const len = stone.length / 2;
                const a = parseInt(stone.substr(0, len));
                const b = parseInt(stone.substr(len));
                newStones.push("" + a);
                newStones.push("" + b);
                continue;
            }
            const value = 2024 * parseInt(stone);
            newStones.push("" + value);
        }

        return newStones;
    }

    memorizeAfterFiveBlinks(stone: any) {
        if (this.afterFiveBlinks[stone] != undefined) {
            return;
        }
        let stones = [stone];
        for (let n = 0; n < 5; n++) {
            stones = this.primitiveBlink(stones);
        }
        this.afterFiveBlinks[stone] = stones;
        for (const newStone of stones) {
            this.memorizeAfterFiveBlinks(newStone);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////

    search() {
        let dict = this.initialStones;
        for (let n = 0; n < 15; n++) {
            dict = this.smartBlink(dict);
        }
        let count = 0;
        for (const value of Object.values(dict)) {
            count += value as any;
        }
        return count;
    }

    smartBlink(srcDict: any) {
        const newDict: any = {};
        for (const stone of Object.keys(srcDict)) {
            const count = srcDict[stone];
            const children = this.afterFiveBlinks[stone];
            for (const child of children) {
                if (newDict[child] == undefined) {
                    newDict[child] = 0;
                }
                newDict[child] += count;
            }
        }
        return newDict;
    }
}
