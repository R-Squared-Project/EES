import Deposit from "../Domain/Deposit";
import RepositoryInterface from "../Domain/RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    private _deposits: {
        [index: string]: Deposit
    } = {}

    isContractExists(contractId: string): Promise<boolean> {
        return Promise.resolve(Object.values(this._deposits).find(deposit => deposit.contractId === contractId) !== undefined)
    }

    getByContractId(contractId: string): Promise<Deposit | null> {
        const deposit = Object.values(this._deposits).find(deposit => deposit.contractId === contractId)

        if (!deposit) {
            return Promise.resolve(null)
        }

        return Promise.resolve(deposit);
    }

    create(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    save(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    get size(): number {
        return Object.values(this._deposits).length
    }
}