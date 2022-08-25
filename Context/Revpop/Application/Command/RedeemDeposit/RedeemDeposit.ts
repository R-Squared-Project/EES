export default class RedeemDeposit {
    constructor(
        private _revpopContractId: string
    ) {}

    get contractId(): string {
        return this._revpopContractId;
    }
}