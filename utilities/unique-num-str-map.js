import { clamp, randomRange } from "./ext-math.js";

export default class UniqueNumStrMap {

    #CHARS = [];

    constructor(strLength) {
        this.init();

        this.strLength = strLength;
        this.charsLength = this.#CHARS.length;
        this.min = Math.pow(this.charsLength, strLength - 1);
        this.max = this.charsLength * this.min;
    }

    init() {
        const a = 'A'.charCodeAt(0);

        for (let i = 0; i < 26; i++) {
            const alphabet = String.fromCharCode(a + i);
            this.#CHARS.push(alphabet);
        }

        for (let i = 0; i < 26; i++) {
            this.#CHARS.push(this.#CHARS[i].toLowerCase());
        }

        for (let i = 0; i < 10; i++) {
            this.#CHARS.push(i.toString());
        }
    }

    getByRandom() {
        const n = randomRange(this.min, this.max - 1);
        return this.getByNum(n);
    }

    getByNum(num) {
        const n = clamp(num, this.min, this.max - 1);
        let q = n, str = '';
        while (q !== 0) {
            const r = q % this.charsLength;
            q = Math.floor(q / this.charsLength);
            str = this.#CHARS[r] + str;
        }
        return [n, str];
    }
}