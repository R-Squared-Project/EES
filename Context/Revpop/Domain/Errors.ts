import {Result} from "../../Core";
import {DomainError} from "../../Core/Domain/DomainError";

export class RedeemUnexpectedError extends Result<DomainError> {
    constructor(message: string) {
        super(false, {
            message
        } as DomainError)
    }
}

export class CreateInRevpopBlockchainUnexpectedError extends Result<DomainError> {
    constructor(message: string) {
        super(false, {
            message
        } as DomainError)
    }
}