import { UseCaseError } from "context/Core/Logic/UseCaseError";

export class BlockIsReversible extends UseCaseError {
    constructor(txHash: string) {
        super(`Block of HTLC redeem operation ${txHash} is reversible.`);
    }
}
