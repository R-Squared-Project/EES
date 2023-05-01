import AbstractValidator from "./../AbstractValidator";
import Withdraw, { STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN } from "context/Domain/Withdraw";
import * as Errors from "context/Domain/Validation/Withdraw/Errors";

export default class ReadyToProcess extends AbstractValidator {
    private withdraw: Withdraw;

    constructor(withdraw: Withdraw) {
        super();

        this.withdraw = withdraw;
    }

    validate(): void {
        this.validateStatus();
    }

    private validateStatus() {
        if (this.withdraw.status !== STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN) {
            throw new Errors.ReadyToProcessError(this.withdraw.id.toValue(), this.withdraw.status);
        }
    }
}
