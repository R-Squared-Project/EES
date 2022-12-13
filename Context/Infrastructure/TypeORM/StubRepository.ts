import RepositoryInterface from "../../Domain/RepositoryInterface";
import Deposit from "../../Domain/Deposit";

export default class StubRepository implements RepositoryInterface {
    public _exists = false

    private _deposits: {
        [index: string]: Deposit
    } = {}

    create(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    exists(contractId: string): Promise<boolean> {
        return Promise.resolve(this._exists)
    }

    first(): Deposit | null {
        return Object.values(this._deposits)[0]
    }

    get size(): number {
        return Object.values(this._deposits).length
    }

    reset() {
        this._deposits = {}
    }
}
