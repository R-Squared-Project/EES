export class ExternalBlockchainError extends Error {}

export class ConnectionError extends ExternalBlockchainError {
    constructor() {
        super('External blockchain connection error');
    }
}

export class RedeemUnexpectedError extends ExternalBlockchainError {
    constructor(contractId: string, message: string) {
        super(`Error while redeem contract ${contractId}: ${message}`);
    }
}
