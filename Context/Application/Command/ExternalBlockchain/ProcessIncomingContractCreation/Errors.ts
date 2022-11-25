import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class TransactionNotFoundInBlockchain extends UseCaseError {
    constructor(hash: string) {
        super(`The transaction with hash "${hash}" was not found in blockchain.`)
    }
}

export class DepositAlreadyExists extends UseCaseError {
    constructor(contractId: string) {
        super(`The deposit with contractId "${contractId}" already exists.`)
    }
}

export class DepositRequestNotExists extends UseCaseError {
    constructor(hashLock: string) {
        super(`The deposit request with hashLock "${hashLock}" is not exists.`)
    }
}

export class ExternalContractNotExists extends UseCaseError {
    constructor(contractId: string) {
        super(`The external contract "${contractId}" is not exists in the blockchain.`)
    }
}

export class ReceiverIsInvalid extends UseCaseError {
    constructor() {
        super('The receiver is invalid.')
    }
}

export class DepositIsToSmall extends UseCaseError {
    constructor(minValue: string, value: string) {
        super(`The deposit ${value} is to small. Minimum deposit is ${minValue}.`)
    }
}

export class TimeLockIsToSmall extends UseCaseError {
    constructor(minMinutes: number, value: string) {
        super(`TimeLock ${value} is to small. Minimum timeLock is ${minMinutes}.`)
    }
}

export class AlreadyWithdrawn extends UseCaseError {
    constructor() {
        super('Contract is already withdrawn.')
    }
}

export class AlreadyRefunded extends UseCaseError {
    constructor() {
        super('Contract is already refunded.')
    }
}
