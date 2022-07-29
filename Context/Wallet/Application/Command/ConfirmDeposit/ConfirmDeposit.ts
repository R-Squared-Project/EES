export default class ConfirmDeposit {
    constructor(
        private _secret: string,
        private _account: string
    ) {}

    get secret(): string {
        return this._secret;
    }

    get account(): string {
        return this._account;
    }
}