export default class CreateDeposit {
    constructor(
        private _txHash: string,
        private _revpopAccount: string
    ) {}

    get txHash(): string {
        return this._txHash;
    }

    get revpopAccount(): string {
        return this._revpopAccount;
    }
}