export default interface ExternalBlockchainCommandInterface {
    get txHash(): string
    get contractId(): string
}