import {Result} from "../../../../Core";
import {UseCaseError} from "../../../../Core/Logic/UseCaseError";

export class DepositAlreadyExists extends Result<UseCaseError> {
    constructor(contractId: string) {
        super(false, {
            message: `The deposit with contractId ${contractId} already exists`
        } as UseCaseError)
    }
}