import AbstractValidator from "./AbstractValidator";
import Deposit, {STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";
import * as Errors from "context/Domain/Errors";

export default class ConfirmDepositInternalContractCreatedValidator extends AbstractValidator {
    private deposit: Deposit

    constructor(deposit: Deposit) {
        super();

        this.deposit = deposit
    }

    validate(): void {
        this.validateStatus()
    }

    private validateStatus() {
        if (this.deposit.status !== STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN) {
            throw new Errors.ConfirmDepositInternalContractCreatedStatusError(this.deposit.status)
        }
    }
}
