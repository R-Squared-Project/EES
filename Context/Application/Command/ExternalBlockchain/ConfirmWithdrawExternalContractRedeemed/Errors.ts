import { UseCaseError } from "context/Core/Logic/UseCaseError";

export class WithdrawNotExists extends UseCaseError {
    constructor(contractId: string) {
        super(`The withdraw with external_blockchain_contract_id "${contractId}" not exists.`);
    }
}
export class ReversibleReceipt extends UseCaseError {
    constructor(blockNumber: string) {
        super(`Receipt from block number "${blockNumber}" is reversible`);
    }
}
