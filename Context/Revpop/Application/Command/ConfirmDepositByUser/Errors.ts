import {Result} from "../../../../Core";
import {UseCaseError} from "../../../../Core/Logic/UseCaseError";

export class DepositAlreadyExists extends Result<UseCaseError> {
    constructor(txHash: string) {
        super(false, {
            message: `The deposit with txHash ${txHash} already exists`
        } as UseCaseError)
    }
}