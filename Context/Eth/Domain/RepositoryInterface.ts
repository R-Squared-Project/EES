import Deposit from "./Deposit";

export default interface RepositoryInterface {
    isContractExists: (contractId: string) => Promise<boolean>
    getByContractId(contractId: string): Promise<Deposit | null>
    create: (deposit: Deposit) => void
    save: (deposit: Deposit) => void
}