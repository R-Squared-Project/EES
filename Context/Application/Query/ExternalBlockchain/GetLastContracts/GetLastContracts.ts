export default class GetLastContracts {
    public constructor(
        private _blockNumber: number | null,
    ) {}

    get blockNumber(): number | null {
        return this._blockNumber;
    }
}
