export default class ConfirmDepositByBlockchain {
    constructor(
        private _txHash: string
    ) {}

    get txHash(): string {
        return this._txHash;
    }
}