import AbstractValidator from "./../AbstractValidator";
import Withdraw, {
    STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN,
    STATUS_READY_TO_PROCESS,
    STATUS_READY_TO_SIGN,
    STATUS_SEND_IN_REPLY,
} from "context/Domain/Withdraw";
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
        if (
            this.withdraw.status !== STATUS_SEND_IN_REPLY &&
            this.withdraw.status !== STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN &&
            this.withdraw.status !== STATUS_READY_TO_PROCESS &&
            this.withdraw.status !== STATUS_READY_TO_SIGN
        ) {
            throw new Errors.ProcessedError(this.withdraw.id.toValue(), this.withdraw.status);
        }
    }
}
