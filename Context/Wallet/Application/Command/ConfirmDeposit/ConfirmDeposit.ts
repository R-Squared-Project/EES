export default class ConfirmDeposit {
    constructor(
        private _sessionId: string,
        private _revpopAccount: string,
        private _txHash: string
    ) {}

    get sessionId(): string {
        return this._sessionId;
    }

    get revpopAccount(): string {
        return this._revpopAccount;
    }

    get txHash(): string {
        return this._txHash;
    }
}