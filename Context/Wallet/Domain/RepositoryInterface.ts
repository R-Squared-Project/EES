import Deposit from "./Deposit";

export default interface RepositoryInterface {
    create: (deposit: Deposit) => void
    save: (deposit: Deposit) => void
    getBySecret: (sessionId: string) => Deposit
}