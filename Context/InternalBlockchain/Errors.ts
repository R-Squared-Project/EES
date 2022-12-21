class ExternalBlockchainError extends Error {}

export class IssueAssetError extends ExternalBlockchainError {
    public constructor() {
        super();
    }
}

export class CreateHtlcError extends ExternalBlockchainError {
    public constructor() {
        super();
    }
}
