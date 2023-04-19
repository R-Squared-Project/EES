import AbstractValidator from "./AbstractValidator";
import Deposit, {STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";
import * as Errors from "context/Domain/Errors";

export default class CompletedValidator extends AbstractValidator {
    private deposit: Deposit

    constructor(deposit: Deposit) {
        super();

        this.deposit = deposit
    }

    validate(): void {
        this.validateStatus()
    }

    private validateStatus() {
        if (this.deposit.status !== STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN) {

            throw new Errors.CompletedStatusError(this.deposit.id.toValue(), this.deposit.status)
        }
    }
}
