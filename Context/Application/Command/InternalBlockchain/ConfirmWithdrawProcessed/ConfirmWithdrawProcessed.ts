import Withdraw from "context/Domain/Withdraw";

export default class ConfirmWithdrawProcessed {
    constructor(public withdraw: Withdraw) {}
}
