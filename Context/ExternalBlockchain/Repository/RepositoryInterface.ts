import Contract from "../Contract";

export default interface RepositoryInterface {
    txIncluded: (txHash: string) => Promise<boolean>
    load: (txHash: string, contractId: string) => Promise<Contract | null>
}
