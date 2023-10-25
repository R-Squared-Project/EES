import AbstractValidator from "./../AbstractValidator";
import * as Errors from "context/Domain/Validation/Withdraw/Errors";
import Withdraw, { STATUS_READY_TO_PROCESS } from "context/Domain/Withdraw";
import config from "context/config";
import dayjs from "dayjs";

export default class CreateWithdrawExternalContractValidator extends AbstractValidator {
    private withdraw: Withdraw;

    constructor(withdraw: Withdraw) {
        super();

        this.withdraw = withdraw;
    }

    validate(): void {
        this.validateStatus();
        this.validateTimelock();
    }

    private validateStatus() {
        if (this.withdraw.status !== STATUS_READY_TO_PROCESS) {
            throw new Errors.CreateWithdrawExternalContractStatusError(
                this.withdraw.id.toValue(),
                this.withdraw.status
            );
        }
    }

    private validateTimelock() {
        const contractCreatedAt = dayjs(this.withdraw.internalContract.createdAt);
        const internalContractTimelockDifference = contractCreatedAt
            .add(config.contract.withdraw_internal_timelock, "minute")
            .diff(dayjs(), "minute");

        const summaryTimelock = config.contract.withdraw_external_timelock + config.r_squared.redeem_timeframe;

        if (internalContractTimelockDifference < summaryTimelock) {
            throw new Errors.InvalidTimelockError(this.withdraw.id.toValue());
        }
    }
}
