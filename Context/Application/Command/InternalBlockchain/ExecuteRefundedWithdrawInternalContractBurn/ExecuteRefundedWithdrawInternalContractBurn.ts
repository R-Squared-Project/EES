import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";

export default class ExecuteRefundedWithdrawInternalContractBurn {
    constructor(public transaction: WithdrawTransaction) {}
}
