export default class OperationBurn {
    constructor(
        private _account: string,
        private _htlcContractId: string,
        private _txHash: string
    ) {}

    public static create(
        account: string,
        htlcContractId: string,
        txHash: string
    ): OperationBurn {
        return new OperationBurn(account, htlcContractId, txHash)
    }

    get htlcContractId(): string {
        return this._htlcContractId
    }

    get txHash(): string {
        return this._txHash
    }
}
