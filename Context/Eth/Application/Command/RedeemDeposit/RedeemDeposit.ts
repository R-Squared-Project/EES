export default class RedeemDeposit {
    constructor(
        private _contractId: string,
        private _secret: string
    ) {}

    get contractId(): string {
        return this._contractId;
    }

    get secret(): string {
        return this._secret;
    }
}