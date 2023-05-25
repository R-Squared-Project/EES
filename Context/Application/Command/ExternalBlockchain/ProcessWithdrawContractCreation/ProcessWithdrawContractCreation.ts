export default class ProcessWithdrawContractCreation {
    constructor(private _txHash: string, private _contractId: string) {}

    get blockchain(): string {
        return "Ethereum";
    }

    get txHash(): string {
        return this._txHash;
    }

    get contractId(): string {
        return this._contractId;
    }
}
