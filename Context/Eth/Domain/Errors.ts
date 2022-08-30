import {Result} from "../../Core";
import {DomainError} from "../../Core/Domain/DomainError";

export class RedeemUnexpectedError extends Result<DomainError> {
    constructor(contractId: string, message: string) {
        super(false, {
            message: `Error while redeem contract ${contractId}: ${message}`
        } as DomainError)
    }
}