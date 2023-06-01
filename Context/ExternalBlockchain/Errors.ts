export class ExternalBlockchainError extends Error {}

export class ConnectionError extends ExternalBlockchainError {
    constructor() {
        super("External blockchain connection error");
    }
}

export class RedeemUnexpectedError extends ExternalBlockchainError {
    constructor(contractId: string, message: string) {
        super(`Error while redeem contract ${contractId}: ${message}`);
    }
}

export class ErrorEstimatingGas extends ExternalBlockchainError {
    constructor(receiver: string, message: string) {
        super(`Error while estimating gas for receiver ${receiver}: ${message}`);
    }
}

export class CreateWithdrawContractUnexpactedError extends ExternalBlockchainError {
    constructor(receiver: string, message: string) {
        super(`Error while creating new contract for receiver ${receiver}: ${message}`);
    }
}

export class RefundUnexpectedError extends ExternalBlockchainError {
    constructor(contractId: string, message: string) {
        super(`Error while refund contract ${contractId}: ${message}`);
    }
}
