import Deposit from "./Deposit";

export default interface DepositRepositoryInterface {
    create: (deposit: Deposit) => void
    save: (deposit: Deposit) => void
    exists: (contractId: string) => Promise<boolean>
    getById: (id: string) => Promise<Deposit | null>
}
