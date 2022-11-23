import {DomainError} from "../Core/Domain/DomainError";

export class CreateDepositUnexpectedError extends DomainError {
    constructor() {
        super('Create Deposit unexpected error');
    }
}

export class CreateDepositRequestUnexpectedError extends DomainError {
    constructor() {
        super('Create DepositRequest unexpected error');
    }
}

export class ValidationError extends Error {}

export class RevpopAccountValidationError extends ValidationError {
    private error: string

    constructor(error: string, revpopAccount: string) {
        super(`Account name "${revpopAccount}" is invalid: ${error}`)

        this.error = error
    }
}

export class HashLockValidationError extends ValidationError {
    private error: string

    constructor(error: string, hashLock: string) {
        super(`HashLock "${hashLock}" is invalid: ${error}`)

        this.error = error
    }
}
