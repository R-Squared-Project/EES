import { DomainError } from "context/Core/Domain/DomainError";

export class ReadyToProcessError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}
