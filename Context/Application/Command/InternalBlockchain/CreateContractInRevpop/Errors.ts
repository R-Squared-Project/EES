import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositNotFound extends UseCaseError {
    constructor(txHash: string) {
        super(`The deposit with tx_hash ${txHash} was not found.`)
    }
}

export class DepositCanNotBeProcess extends UseCaseError {
    constructor(txHash: string) {
        super(`The deposit with tx_hash ${txHash} can't be process. Can't create contract in revpop blockchain.`)
    }
}
