class InfrastructureError extends Error {}

export class DatabaseConnectionError extends InfrastructureError {}
export class ExternalBlockchainConnectionError extends InfrastructureError {}
