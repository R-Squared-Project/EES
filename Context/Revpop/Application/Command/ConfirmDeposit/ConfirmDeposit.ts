export default class ConfirmDeposit {
    constructor(
        private _txHash: string
    ) {}

    get txHash(): string {
        return this._txHash;
    }
}