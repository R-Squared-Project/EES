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
