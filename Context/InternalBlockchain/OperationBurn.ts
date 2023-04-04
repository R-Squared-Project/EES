export default class OperationBurn {
    constructor(
        private _account: string,
        private _txHash: string
    ) {}

    public static create(
        account: string,
        txHash: string
    ): OperationBurn {
        return new OperationBurn(account, txHash)
    }

    get txHash(): string {
        return this._txHash
    }
}
