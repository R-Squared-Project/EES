import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    getBySessionId(sessionId: string): Promise<Deposit | null> {
        const deposit = Object.values(this._deposits).find(deposit => deposit.sessionId.value === sessionId)
        return Promise.resolve(deposit ?? null)
    }

    create(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    save(deposit: Deposit): void {
        if (!(deposit.id.toValue() in this._deposits)) {
            throw new Error("Deposit not found!")
        }

        this._deposits[deposit.id.toValue()] = deposit
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}