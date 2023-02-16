export default class ConfirmDepositInternalContractCreated {
    constructor(
        private _externalId: string,
        private _internalId: string
    ) {}

    get internalId(): string {
        return this._internalId;
    }

    get externalId(): string {
        return this._externalId;
    }
}
