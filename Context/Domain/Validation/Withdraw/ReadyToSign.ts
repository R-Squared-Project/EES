import AbstractValidator from "./../AbstractValidator";
import Withdraw, { STATUS_READY_TO_SIGN, STATUS_SEND_IN_REPLY } from "context/Domain/Withdraw";
import * as Errors from "context/Domain/Validation/Withdraw/Errors";

export default class ReadyToSign extends AbstractValidator {
    private withdraw: Withdraw;

    constructor(withdraw: Withdraw) {
        super();

        this.withdraw = withdraw;
    }

    validate(): void {
        this.validateStatus();
    }

    private validateStatus() {
        if (this.withdraw.status !== STATUS_SEND_IN_REPLY) {
            throw new Errors.ReadyToSignStatusError(this.withdraw.id.toValue(), this.withdraw.status);
        }
    }
}
