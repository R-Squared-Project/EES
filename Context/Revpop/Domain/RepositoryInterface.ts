import Deposit from "./Deposit";

export default interface RepositoryInterface {
    create: (deposit: Deposit) => Promise<void>
    getByTxHash: (txHash: string) => Promise<Deposit | null>
    save: (deposit: Deposit) => Promise<void>
}