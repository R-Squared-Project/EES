import Deposit from "./Deposit";

export default class RepositoryInterface {
    create: (deposit: Deposit) => void
    getBySecret: (secret: string) => Deposit
}