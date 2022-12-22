import {UseCaseError} from "../../../Core/Logic/UseCaseError";

export class DepositNotFoundError extends UseCaseError {
    constructor(sessionId: string) {
        super(`The deposit with sessionId ${sessionId} is not found`)
    }
}
