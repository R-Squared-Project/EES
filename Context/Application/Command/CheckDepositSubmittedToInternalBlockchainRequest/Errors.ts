import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositNotFound extends UseCaseError {
    constructor(sessionId: string) {
        super(`The deposit request with deposit request ${sessionId} not found.`)
    }
}
