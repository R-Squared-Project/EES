import AbstractValidator from "./../AbstractValidator";
import Withdraw, {STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN } from "context/Domain/Withdraw";
import * as Errors from "context/Domain/Validation/Withdraw/Errors";

export default class WithdrawRedeemed extends AbstractValidator {
    private withdraw: Withdraw;

    constructor(withdraw: Withdraw) {
        super();

        this.withdraw = withdraw;
    }

    validate(): void {
        this.validateStatus();
    }

    private validateStatus() {
        if (this.withdraw.status !== STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN) {
            throw new Errors.RedeemedError(this.withdraw.id.toValue(), this.withdraw.status);
        }
    }
}
