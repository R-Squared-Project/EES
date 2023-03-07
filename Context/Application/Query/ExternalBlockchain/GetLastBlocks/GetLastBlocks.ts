export default class GetLastBlocks {
    public constructor(
        private _blockNumber: number | null,
    ) {}

    get blockNumber(): number | null {
        return this._blockNumber;
    }
}
