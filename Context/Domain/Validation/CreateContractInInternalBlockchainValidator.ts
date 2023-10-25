import dayjs, { Dayjs } from "dayjs";
import AbstractValidator from "./AbstractValidator";
import Deposit, { STATUS_CREATED } from "context/Domain/Deposit";
import * as Errors from "context/Domain/Errors";
import config from "context/config";

export default class CreateContractInInternalBlockchainValidator extends AbstractValidator {
    private deposit: Deposit;

    constructor(deposit: Deposit) {
        super();

        this.deposit = deposit;
    }

    validate(): void {
        this.validateStatus();
        this.validateTimeLock();
    }

    private validateStatus() {
        if (this.deposit.status !== STATUS_CREATED) {
            throw new Errors.CreateContractInInternalBlockchainStatusError(this.deposit.status);
        }
    }

    private validateTimeLock() {
        const externalContractTimeLock = this.deposit._externalContract.timeLock.value as Dayjs;
        const timeLockExternalContract = config.eth.redeem_timeframe;
        const timeLockInternalContract = config.r_squared.redeem_timeframe;

        if (externalContractTimeLock.diff(dayjs(), "minutes") < timeLockInternalContract + timeLockExternalContract) {
            throw new Errors.CreateContractInInternalBlockchainTimeLockError(externalContractTimeLock);
        }
    }
}
