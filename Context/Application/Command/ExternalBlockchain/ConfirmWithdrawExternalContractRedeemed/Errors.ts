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

export class ContractWithdrawnIsFalse extends UseCaseError {
    constructor(contractId: string) {
        super(`Contract ${contractId} is not withdrawn`);
    }
}

export class ContractNotFound extends UseCaseError {
    constructor(contractId: string, txHash: string) {
        super(`Contract ${contractId} with ${txHash} not found`);
    }
}

export class ContractWithoutPreimage extends UseCaseError {
    constructor(contractId: string) {
        super(`Contract ${contractId} without preimage`);
    }
}
