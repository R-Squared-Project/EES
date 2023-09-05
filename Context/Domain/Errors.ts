import { DomainError } from "../Core/Domain/DomainError";
import { UseCaseError } from "context/Core/Logic/UseCaseError";
import { Dayjs } from "dayjs";

export class CreateDepositUnexpectedError extends DomainError {
    constructor() {
        super("Create Deposit unexpected error");
    }
}

export class CreateDepositRequestUnexpectedError extends DomainError {
    constructor() {
        super("Create DepositRequest unexpected error");
    }
}

export class ValidationError extends DomainError {}

export class RevpopAccountValidationError extends ValidationError {
    private error: string;

    constructor(error: string, revpopAccount: string) {
        super(`Account name "${revpopAccount}" is invalid: ${error}`);

        this.error = error;
    }
}

export class HashLockValidationError extends ValidationError {
    private error: string;

    constructor(error: string, hashLock: string) {
        super(`HashLock "${hashLock}" is invalid: ${error}`);

        this.error = error;
    }
}

export class TxHashValidationError extends ValidationError {
    private error: string;

    constructor(error: string, txHash: string) {
        super(`Transaction hash "${txHash}" is invalid: ${error}`);

        this.error = error;
    }
}

export class AddressValidationError extends ValidationError {
    private error: string;

    constructor(error: string, address: string) {
        super(`Address "${address}" is invalid: ${error}`);

        this.error = error;
    }
}

export class ReceiverIsInvalid extends UseCaseError {
    constructor() {
        super("The receiver is invalid.");
    }
}

export class SenderIsInvalid extends UseCaseError {
    constructor() {
        super("The sender is invalid.");
    }
}

export class DepositIsToSmall extends UseCaseError {
    constructor(minValue: string, value: string) {
        super(`The deposit ${value} is to small. Minimum deposit is ${minValue}.`);
    }
}

export class TimeLockIsToSmall extends UseCaseError {
    constructor(contractTimeLock: string, minMinutes: string) {
        super(`TimeLock ${contractTimeLock} is to small. Minimum timeLock is ${minMinutes}.`);
    }
}

export class AlreadyWithdrawn extends UseCaseError {
    constructor() {
        super("Contract is already withdrawn.");
    }
}

export class AlreadyRefunded extends UseCaseError {
    constructor() {
        super("Contract is already refunded.");
    }
}

export class PreimageNotEmpty extends UseCaseError {
    constructor() {
        super("Preimage is not empty.");
    }
}

export class CreateContractInInternalBlockchainStatusError extends DomainError {
    constructor(status: number) {
        super(`Status ${status} is invalid.`);
    }
}

export class CreateContractInInternalBlockchainTimeLockError extends DomainError {
    constructor(externalContractTimeLock: Dayjs) {
        super(`External blockchain timeLock ${externalContractTimeLock.format()} is invalid.`);
    }
}

export class ConfirmDepositInternalContractCreatedStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`DepositId: ${id}. Status ${status} is invalid.`);
    }
}

export class ConfirmDepositInternalContractRedeemedStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`DepositId: ${id}. Status ${status} is invalid.`);
    }
}

export class RedeemExecutedInExternalBlockchainStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`DepositId: ${id}. Status ${status} is invalid.`);
    }
}

export class CompletedStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`DepositId: ${id}. Status ${status} is invalid.`);
    }
}

export class BurnedStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`DepositId: ${id}. Status ${status} is invalid.`);
    }
}

export class BurnedAmountError extends DomainError {
    constructor(id: string, burnedAmount: string, mintedAmount: string) {
        super(`DepositId: ${id}. Burned amount ${burnedAmount} is greater than minted amount ${mintedAmount}`);
    }
}

export class WithdrawRequestValidationError extends UseCaseError {}
