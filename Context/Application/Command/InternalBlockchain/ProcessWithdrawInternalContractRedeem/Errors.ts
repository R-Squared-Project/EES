import { UseCaseError } from "context/Core/Logic/UseCaseError";

export class WithdrawNotFound extends UseCaseError {
    constructor(txHash: string) {
        super(`The withdraw with tx_hash ${txHash} was not found.`);
    }
}

export class WithdrawWithoutSecret extends UseCaseError {
    constructor(withdrawId: string) {
        super(`The withdraw ${withdrawId} without secret.`);
    }
}
