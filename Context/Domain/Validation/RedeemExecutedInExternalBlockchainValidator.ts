import AbstractValidator from "./AbstractValidator";
import Deposit, {STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN} from "context/Domain/Deposit";
import * as Errors from "context/Domain/Errors";

export default class RedeemExecutedInExternalBlockchainValidator extends AbstractValidator {
    private deposit: Deposit

    constructor(deposit: Deposit) {
        super();

        this.deposit = deposit
    }

    validate(): void {
        this.validateStatus()
    }

    private validateStatus() {
        if (this.deposit.status !== STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN) {
            throw new Errors.RedeemExecutedInExternalBlockchainStatusError(this.deposit.id.toValue(), this.deposit.status)
        }
    }
}
