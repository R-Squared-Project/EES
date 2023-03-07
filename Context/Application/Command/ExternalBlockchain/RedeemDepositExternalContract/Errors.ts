import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositNotExists extends UseCaseError {
    constructor(id: string) {
        super(`The deposit with id "${id}" not exists.`)
    }
}
