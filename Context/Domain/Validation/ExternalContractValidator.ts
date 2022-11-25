import Web3 from "web3";
import dayjs from "dayjs";
import AbstractValidator from "./AbstractValidator";
import config from "context/config";
import Contract from "context/ExternalBlockchain/Contract";
import {
    AlreadyRefunded,
    AlreadyWithdrawn,
    DepositIsToSmall,
    ReceiverIsInvalid, TimeLockIsToSmall
} from "context/Application/Command/ExternalBlockchain/ProcessIncomingContractCreation/Errors";

export default class ExternalContractValidator extends AbstractValidator {
    private externalContract: Contract

    constructor(externalContract: Contract) {
        super();

        this.externalContract = externalContract
    }

    validate(): void {
        this.validateReceiver()
    }

    private validateReceiver() {
        if (this.externalContract.receiver !== config.eth.receiver) {
            throw new ReceiverIsInvalid()
        }

        const contractValue = Web3.utils.toBN(this.externalContract.value)
        if (contractValue < config.eth.minimum_deposit_amount) {
            throw new DepositIsToSmall(
                config.eth.minimum_deposit_amount.toString(),
                contractValue.toString(),
            )
        }

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

        if (this.externalContract.withdrawn) {
            throw new AlreadyWithdrawn()
        }

        if (this.externalContract.refunded) {
            throw new AlreadyRefunded()
        }

    }

}
