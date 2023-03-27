export default class DepositInternalContractRefund {
    constructor(
        private _depositId: string
    ) {}

    get depositId(): string {
        return this._depositId
    }
}
