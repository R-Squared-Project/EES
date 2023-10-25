import AbstractValidator from "context/Domain/Validation/AbstractValidator";
import config from "context/config";
import * as Errors from "context/Domain/Errors";
import dayjs from "dayjs";
import Web3 from "web3";
import { HashZero } from "@ethersproject/constants";
import Contract from "context/ExternalBlockchain/Contract";
import SanctionedAddress from "../../../../src/assets/SanctionedAddresses/sanctioned_addresses_ETH.json";

export default class DepositExternalContractValidator extends AbstractValidator {
    constructor(private externalContract: Contract) {
        super();
    }

    validate(): void {
        this.validateReceiver();
        this.validateSender();
        this.validateValue();
        this.validateWithdrawn();
        this.validateRefunded();
        this.validatePreimage();
    }

    private validateReceiver() {
        if (this.externalContract.receiver !== config.eth.receiver) {
            throw new Errors.ReceiverIsInvalid();
        }
    }

    public validateTimeLock() {
        const timeLockLimit = dayjs().add(config.contract.minimum_timelock, "minutes");

        if (this.externalContract.timeLock < timeLockLimit.unix()) {
            throw new Errors.TimeLockIsToSmall(
                dayjs.unix(this.externalContract.timeLock).format(),
                timeLockLimit.format()
            );
        }
    }

    private validateValue() {
        const contractValue = Web3.utils.toBN(this.externalContract.value);
        if (contractValue < config.eth.minimum_deposit_amount) {
            throw new Errors.DepositIsToSmall(config.eth.minimum_deposit_amount.toString(), contractValue.toString());
        }
    }

    private validateWithdrawn() {
        if (this.externalContract.withdrawn) {
            throw new Errors.AlreadyWithdrawn();
        }
    }

    private validateRefunded() {
        if (this.externalContract.refunded) {
            throw new Errors.AlreadyRefunded();
        }
    }

    private validatePreimage() {
        if (this.externalContract.preimage !== HashZero) {
            throw new Errors.PreimageNotEmpty();
        }
    }

    private validateSender() {
        if(SanctionedAddress.includes(this.externalContract.sender)){
            throw new Errors.SenderIsSanctioned();
        }
    }
}
