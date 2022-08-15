import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    async create(deposit: Deposit): Promise<void> {
        this._deposits[deposit.id.toValue()] = deposit
    }

    async getByTxHash(txHash: string): Promise<Deposit | null> {
        const deposit = Object.values(this._deposits).find(deposit => deposit.txHash.value === txHash)
        return Promise.resolve(deposit ?? null)
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}