import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositNotFound extends UseCaseError {
    constructor(depositId: string) {
        super(`The deposit with ID:${depositId} was not found.`)
    }
}
