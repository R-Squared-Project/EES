import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";

export default class ConfirmWithdrawInternalContractCreated {
    constructor(public transaction: WithdrawTransaction) {}
}
