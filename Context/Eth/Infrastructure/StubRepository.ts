import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    isContractExists(contractId: string): Promise<boolean> {
        return Promise.resolve(Object.values(this._deposits).find(deposit => deposit.contractId === contractId) !== undefined)
    }

    create(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}