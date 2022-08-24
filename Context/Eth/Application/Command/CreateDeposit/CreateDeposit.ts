export default class CreateDeposit {
    constructor(
        private _txHash: string,
        private _contractId: string
    ) {}

    get txHash(): string {
        return this._txHash;
    }

    get contractId(): string {
        return this._contractId;
    }
}