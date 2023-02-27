export default class ConfirmDepositInternalContractCreated {
    constructor(
        private _txHash: string,
        private _internalId: string
    ) {}

    get internalId(): string {
        return this._internalId;
    }

    get txHash(): string {
        return this._txHash;
    }
}
