import { UseCaseError } from "context/Core/Logic/UseCaseError";

export class PersistentError extends UseCaseError {}

export class WithdrawNotExists extends PersistentError {
    constructor(id: string) {
        super(`The withdraw with id "${id}" not exists.`);
    }
}

export class ValidationError extends PersistentError {}
