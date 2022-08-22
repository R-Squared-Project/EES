import {Result} from "../../../../Core";
import {UseCaseError} from "../../../../Core/Logic/UseCaseError";

export class DepositNotFound extends Result<UseCaseError> {
    constructor(txHash: string) {
        super(false, {
            message: `The deposit with txHash ${txHash} is not found`
        } as UseCaseError)
    }
}