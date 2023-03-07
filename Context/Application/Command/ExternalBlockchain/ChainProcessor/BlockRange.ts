export default class BlockRange {
    constructor(
        private readonly _fromBlock: number,
        private readonly _toBlock: number,
    ) {}

    get fromBlock(): number {
        return this._fromBlock;
    }

    get toBlock(): number {
        return this._toBlock;
    }
}
