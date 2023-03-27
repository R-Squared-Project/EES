import AbstractValidator from "./AbstractValidator";
import Deposit, {
    STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN,
    STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN
} from "context/Domain/Deposit";
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
        if (this.deposit.status !== STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN) {

            throw new Errors.CompletedStatusError(this.deposit.id.toValue(), this.deposit.status)
        }
    }
}
