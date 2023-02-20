import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositNotFound extends UseCaseError {
    constructor(txHash: string) {
        super(`The deposit with external tx_hash ${txHash} was not found.`)
    }
}
