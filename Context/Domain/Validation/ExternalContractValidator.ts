import Web3 from "web3";
import dayjs from "dayjs";
import {HashZero} from "@ethersproject/constants"
import AbstractValidator from "./AbstractValidator";
import config from "context/config";
import Contract from "context/ExternalBlockchain/Contract";
import {
    AlreadyRefunded,
    AlreadyWithdrawn,
    DepositIsToSmall, PreimageNotEmpty,
    ReceiverIsInvalid,
    TimeLockIsToSmall
} from "context/Domain/Errors";

export default class ExternalContractValidator extends AbstractValidator {
    private externalContract: Contract

    constructor(externalContract: Contract) {
        super();

        this.externalContract = externalContract
    }

    validate(): void {
        this.validateReceiver()
        this.validateTimeLock()
        this.validateValue()
        this.validateWithdrawn()
        this.validateRefunded()
        this.validatePreimage()
    }

    private validateReceiver() {
        if (this.externalContract.receiver !== config.eth.receiver) {
            throw new ReceiverIsInvalid()
        }
    }

    private validateTimeLock() {
        const timeLockLimit = this.externalContract.createdAt.add(
            config.contract.minimum_timelock,
            'minutes'
        ).unix()

        if (this.externalContract.timeLock < timeLockLimit) {
            throw new TimeLockIsToSmall(
                dayjs.duration(config.contract.minimum_timelock).asMinutes(),
                dayjs.unix(this.externalContract.timeLock).format(),
            )
        }
    }

    private validateValue() {
        const contractValue = Web3.utils.toBN(this.externalContract.value)
        if (contractValue < config.eth.minimum_deposit_amount) {
            throw new DepositIsToSmall(
                config.eth.minimum_deposit_amount.toString(),
                contractValue.toString(),
            )
        }
    }

    private validateWithdrawn() {
        if (this.externalContract.withdrawn) {
            throw new AlreadyWithdrawn()
        }
    }

    private validateRefunded() {
        if (this.externalContract.refunded) {
            throw new AlreadyRefunded()
        }
    }

    private validatePreimage() {
        if (this.externalContract.preimage !== HashZero) {
            throw new PreimageNotEmpty()
        }
    }
}
