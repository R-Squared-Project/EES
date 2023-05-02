import AbstractValidator from "./AbstractValidator";
import Deposit, {STATUS_BURNED} from "context/Domain/Deposit";
import * as Errors from "context/Domain/Errors";

export default class RefundedValidator extends AbstractValidator {
    private deposit: Deposit

    constructor(deposit: Deposit) {
        super();

        this.deposit = deposit
    }

    validate(): void {
        this.validateStatus()
    }

    private validateStatus() {
        if (this.deposit.status !== STATUS_BURNED) {

            throw new Errors.CompletedStatusError(this.deposit.id.toValue(), this.deposit.status)
        }
    }
}
