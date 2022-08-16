export default class RedeemDeposit {
    constructor(
        private _txHash: string,
        private _secret: string,
    ) {}

    get txHash(): string {
        return this._txHash;
    }

    get secret(): string {
        return this._secret;
    }
}