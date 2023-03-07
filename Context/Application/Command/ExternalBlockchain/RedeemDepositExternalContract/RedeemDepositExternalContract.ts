export default class RedeemDepositExternalContract {
    constructor(
        private _depositId: string
    ) {}

    get depositId(): string {
        return this._depositId;
    }
}
