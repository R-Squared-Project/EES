import AbstractValidator from "context/Domain/Validation/AbstractValidator";
import config from "context/config";
import * as Errors from "context/Domain/Errors";
import { HashZero } from "@ethersproject/constants";
import Contract from "context/ExternalBlockchain/Contract";
import Web3 from "web3";

export default class WithdrawExternalContractValidator extends AbstractValidator {
    constructor(private externalContract: Contract) {
        super();
    }

    validate(): void {
        this.validateSender();
        this.validateValue();
        this.validateWithdrawn();
        this.validateRefunded();
        this.validatePreimage();
    }

    private validateSender() {
        if (this.externalContract.sender !== config.eth.receiver) {
            throw new Errors.SenderIsInvalid();
        }
    }

    private validateValue() {
        const contractValue = Web3.utils.toBN(this.externalContract.value);
        if (contractValue.cmp(config.eth.minimum_withdraw_amount) < 0) {
            throw new Errors.WithdrawAmountIsToSmall(config.eth.minimum_withdraw_amount.toString(), contractValue.toString());
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
}
