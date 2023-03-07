import ExternalBlockchainCommandInterface
    from "context/Application/Command/ExternalBlockchain/ChainProcessor/ExternalBlockchainCommandInterface";

export default class ProcessIncomingContractCreation implements ExternalBlockchainCommandInterface{
    constructor(
        private _txHash: string,
        private _contractId: string
    ) {}

    get blockchain(): string {
        return 'Ethereum';
    }

    get txHash(): string {
        return this._txHash;
    }

    get contractId(): string {
        return this._contractId;
    }
}
