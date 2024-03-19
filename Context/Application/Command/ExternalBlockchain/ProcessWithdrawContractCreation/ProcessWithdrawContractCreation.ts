export default class ProcessWithdrawContractCreation {
    constructor(private _hashLock: string, private _txHash: string, private _contractId: string) {}

    get hashLock(): string {
        return this._hashLock;
    }

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
