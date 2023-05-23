import AbstractValidator from "./../AbstractValidator";
import Withdraw, { STATUS_READY_TO_PROCESS } from "context/Domain/Withdraw";
import * as Errors from "context/Domain/Validation/Withdraw/Errors";

export default class SendInReply extends AbstractValidator {
    private withdraw: Withdraw;

    constructor(withdraw: Withdraw) {
        super();

        this.withdraw = withdraw;
    }

    validate(): void {
        this.validateStatus();
    }

    private validateStatus() {
        if (this.withdraw.status !== STATUS_READY_TO_PROCESS) {
            throw new Errors.SendInReplyStatusError(this.withdraw.id.toValue(), this.withdraw.status);
        }
    }
}
