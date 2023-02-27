export default class OperationRedeem {
    constructor(
        private _account: string,
        private _htlcContractId: string,
        private _secret: string,
        private _transactionId: string
    ) {}

    public static create(
        account: string,
        htlcContractId: string,
        secret: string,
        transactionId: string
    ): OperationRedeem {
        return new OperationRedeem(account, htlcContractId, secret, transactionId)
    }

    get htlcContractId(): string {
        return this._htlcContractId
    }

    get secret(): string {
        return this._secret
    }
}
