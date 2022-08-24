import ContractRepositoryInterface from "../Domain/ContractRepositoryInterface";
import Contract from "../Domain/Contract";

export default class StubContractRepository implements ContractRepositoryInterface {
    private txHashes: string[] = []

    private contracts: {
        [contractId: string]: Contract
    } = {}

    async isTxIncluded(txHash: string): Promise<boolean> {
        return Promise.resolve(this.txHashes.includes(txHash))
    }

    async load(txHash: string, contractId: string): Promise<Contract> {
        return Promise.resolve(this.contracts[contractId]) ?? null
    }

    addTxHash(txHash: string) {
        this.txHashes.push(txHash)
    }

    addContract(contract: Contract) {
        this.contracts[contract.contractId] = contract
    }
}