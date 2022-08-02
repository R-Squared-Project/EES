import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    getBySecret(sessionId: string): Deposit {
        return this._deposits[sessionId] ?? null
    }

    create(deposit: Deposit): void {
        this._deposits[deposit.sessionId] = deposit
    }

    save(deposit: Deposit): void {
        if (!(deposit.sessionId in this._deposits)) {
            throw new Error("Deposit not found!")
        }

        this._deposits[deposit.sessionId] = deposit
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}