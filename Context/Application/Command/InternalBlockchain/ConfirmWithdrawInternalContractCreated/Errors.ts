import { UseCaseError } from "context/Core/Logic/UseCaseError";

export class WithdrawNotFound extends UseCaseError {
    constructor(txHash: string) {
        super(`The withdraw with external tx_hash ${txHash} was not found.`);
    }
}
