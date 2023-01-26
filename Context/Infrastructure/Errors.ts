class InfrastructureError extends Error {}

export class DatabaseConnectionError extends InfrastructureError {}
export class ExternalBlockchainConnectionError extends InfrastructureError {}
export class InternalBlockchainConnectionError extends InfrastructureError {}
