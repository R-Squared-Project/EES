import Contract from "./Contract";

export default interface ContractRepositoryInterface {
    isTxIncluded: (hash: string) => Promise<boolean>
    load: (txHash: string, contractId: string) => Promise<Contract>
}