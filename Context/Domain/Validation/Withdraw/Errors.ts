import { DomainError } from "context/Core/Domain/DomainError";

export class ReadyToProcessError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}

export class CreateWithdrawExternalContractStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}

export class InvalidTimelockError extends DomainError {
    constructor(id: string) {
        super(`WithdrawId: ${id}. Timelock is invalid, must be later.`);
    }
}

export class SendInReplyStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}

export class ReadyToSignStatusError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}

export class RedeemError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}

export class RedeemedError extends DomainError {
    constructor(id: string, status: number) {
        super(`WithdrawId: ${id}. Status ${status} is invalid.`);
    }
}
