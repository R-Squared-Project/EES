import AbstractValidator from "./../AbstractValidator";
import Withdraw, { STATUS_REFUND } from "context/Domain/Withdraw";
import * as Errors from "context/Domain/Validation/Withdraw/Errors";

export default class WithdrawRefund extends AbstractValidator {
    private withdraw: Withdraw;

    constructor(withdraw: Withdraw) {
        super();

        this.withdraw = withdraw;
    }

    validate(): void {
        this.validateStatus();
    }

    private validateStatus() {
        if (this.withdraw.status !== STATUS_REFUND) {
            throw new Errors.ProcessedError(this.withdraw.id.toValue(), this.withdraw.status);
        }
    }
}
