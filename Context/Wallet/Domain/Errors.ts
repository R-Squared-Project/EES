import {Result} from "../../Core";
import {DomainError} from "../../Core/Domain/DomainError";

export class DepositAlreadyConfirmed extends Result<DomainError>{
    constructor() {
        super(false, {
            message: `The deposit was already confirmed`
        } as DomainError)
    }
}