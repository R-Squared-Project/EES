import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";

export default class Response {
    constructor(private readonly _transactions: WithdrawTransaction[]) {}

    get transactions(): WithdrawTransaction[] {
        return this._transactions;
    }
}
