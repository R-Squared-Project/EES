import {Result} from "../../../../Core";
import {UseCaseError} from "../../../../Core/Logic/UseCaseError";

export class TransactionNotFoundInBlockchain extends Result<UseCaseError> {
    constructor(hash: string) {
        super(false, {
            message: `The transaction with hash ${hash} was not found in blockchain.`
        } as UseCaseError)
    }
}

export class DepositAlreadyExists extends Result<UseCaseError> {
    constructor(contractId: string) {
        super(false, {
            message: `The deposit with contractId ${contractId} already exists.`
        } as UseCaseError)
    }
}

export class ReceiverIsInvalid extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `The receiver is invalid.`
        } as UseCaseError)
    }
}

export class DepositIsToSmall extends Result<UseCaseError> {
    constructor(minValue: string, value: string) {
        super(false, {
            message: `The deposit ${value} is to small. Minimum deposit is ${minValue}.`
        } as UseCaseError)
    }
}

export class TimeLockIsToSmall extends Result<UseCaseError> {
    constructor(minMinutes: number, value: string) {
        super(false, {
            message: `TimeLock ${value} is to small. Minimum timeLock is ${minMinutes}.`
        } as UseCaseError)
    }
}

export class AlreadyWithdrawn extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `Contract is already withdrawn.`
        } as UseCaseError)
    }
}

export class AlreadyRefunded extends Result<UseCaseError> {
    constructor() {
        super(false, {
            message: `Contract is already refunded.`
        } as UseCaseError)
    }
}