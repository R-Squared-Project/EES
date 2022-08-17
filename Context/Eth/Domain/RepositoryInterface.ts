import Deposit from "./Deposit";

export default interface RepositoryInterface {
    isContractExists: (contractId: string) => Promise<boolean>
    create: (deposit: Deposit) => void
}