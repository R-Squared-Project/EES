import { OperationType } from "context/InternalBlockchain/WithdrawTransactionsCollection";

export default class GetLastWithdrawContracts {
    constructor(private _lastOperation: string, private _operationType: OperationType) {}

    get lastOperation(): string {
        return this._lastOperation;
    }

    get operationType(): OperationType {
        return this._operationType;
    }
}
