import Deposit from "./Deposit";

export default interface RepositoryInterface {
    create: (deposit: Deposit) => void
    save: (deposit: Deposit) => void
    exists: (contractId: string) => Promise<boolean>
    getById: (id: string) => Promise<Deposit | null>
}
