export default class ConfirmDepositInternalContractRedeemed {
    constructor(
        private _depositId: string
    ) {}

    get depositId(): string {
        return this._depositId
    }
}
