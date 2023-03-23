export default class ConfirmDepositExternalContractRedeemed {
    constructor(
        private _txHash: string
    ) {}

    get blockchain(): string {
        return 'Ethereum';
    }

    get txHash(): string {
        return this._txHash;
    }
}
