import Web3 from "web3";
import dayjs from "dayjs";
import AbstractValidator from "./AbstractValidator";
import config from "context/config";
import * as Errors from "context/Domain/Errors";
import ExternalContract from "context/Domain/ExternalContract";

export default class ExternalContractValidator extends AbstractValidator {
    private externalContract: ExternalContract

    constructor(externalContract: ExternalContract) {
        super();

        this.externalContract = externalContract
    }

    validate(): void {
        this.validateReceiver()
        this.validateTimeLock()
        this.validateValue()

    }

    private validateReceiver() {
        if (this.externalContract.receiver.value !== config.eth.receiver) {
            throw new Errors.ReceiverIsInvalid()
        }
    }

    private validateTimeLock() {
        const timeLockLimit = dayjs().add(
            config.contract.minimum_timelock,
            'minutes'
        ).unix()

        if (this.externalContract.timeLock.unix < timeLockLimit) {
            throw new Errors.TimeLockIsToSmall(
                dayjs.duration(config.contract.minimum_timelock).asMinutes(),
                dayjs.unix(this.externalContract.timeLock.unix).format(),
            )
        }
    }

    private validateValue() {
        const contractValue = Web3.utils.toBN(this.externalContract.value)
        if (contractValue < config.eth.minimum_deposit_amount) {
            throw new Errors.DepositIsToSmall(
                config.eth.minimum_deposit_amount.toString(),
                contractValue.toString(),
            )
        }
    }
}
