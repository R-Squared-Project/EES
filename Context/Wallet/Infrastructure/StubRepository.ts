import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    getBySecret(sessionId: string): Promise<Deposit | null> {
        return Promise.resolve(this._deposits[sessionId] ?? null)
    }

    create(deposit: Deposit): void {
        this._deposits[deposit.sessionId.id.toValue()] = deposit
    }

    save(deposit: Deposit): void {
        if (!(deposit.sessionId.id.toValue() in this._deposits)) {
            throw new Error("Deposit not found!")
        }

        this._deposits[deposit.sessionId.id.toValue()] = deposit
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}