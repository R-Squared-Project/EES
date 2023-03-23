import {UseCaseError} from "context/Core/Logic/UseCaseError";

export class DepositNotExists extends UseCaseError {
    constructor(redeemTxHash: string) {
        super(`The deposit with external_blockchain_redeem_tx_hash "${redeemTxHash}" not exists.`)
    }
}

export class ReversibleReceipt extends UseCaseError {
    constructor(blockNumber: string) {
        super(`Receipt from block number "${blockNumber}" is reversible`);
    }
}
