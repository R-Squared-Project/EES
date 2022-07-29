import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    getBySecret(secret: string): Deposit {
        return this._deposits[secret] ?? null
    }

    create(deposit: Deposit): void {
        this._deposits[deposit.secret] = deposit
    }

    save(deposit: Deposit): void {
        if (!(deposit.secret in this._deposits)) {
            throw new Error("Deposit not found!")
        }

        this._deposits[deposit.secret] = deposit
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}