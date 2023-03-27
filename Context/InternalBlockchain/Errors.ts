class ExternalBlockchainError extends Error {}

export class AssetNotFoundError extends ExternalBlockchainError {
    public constructor(asset: string) {
        super(`Asset ${asset} not found.`);
    }
}

export class IssueAssetError extends ExternalBlockchainError {
    public constructor() {
        super();
    }
}

export class ReserveAssetError extends ExternalBlockchainError {
    public constructor() {
        super();
    }
}

export class CreateHtlcError extends ExternalBlockchainError {
    public constructor() {
        super();
    }
}

export class AccountNotFound extends ExternalBlockchainError {
    public constructor(account: string) {
        super(`Account "${account}" is not found.`);
    }
}
