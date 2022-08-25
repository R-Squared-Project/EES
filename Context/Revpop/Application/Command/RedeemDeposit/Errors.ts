import {Result} from "../../../../Core";
import {UseCaseError} from "../../../../Core/Logic/UseCaseError";

export class DepositNotFound extends Result<UseCaseError> {
    constructor(contractId: string) {
        super(false, {
            message: `The deposit with revpop id ${contractId} was not found`
        } as UseCaseError)
    }
}