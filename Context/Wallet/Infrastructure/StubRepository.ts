import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    getBySecret(secret: string): Deposit {
        return undefined;
    }

    create(deposit: Deposit): void {

    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}