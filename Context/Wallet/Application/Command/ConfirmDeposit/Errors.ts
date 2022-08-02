import {Result} from "../../../../Core";
import {UseCaseError} from "../../../../Core/Logic/UseCaseError";

export class DepositNotFoundError extends Result<UseCaseError> {
    constructor(sessionId: string) {
        super(false, {
            message: `The deposit with ${sessionId} is not found`
        } as UseCaseError)
    }
}