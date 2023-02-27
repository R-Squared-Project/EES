import DepositRepositoryInterface from "context/Domain/DepositRepositoryInterface";
import Deposit from "../../Domain/Deposit";

export default class DepositRepository implements DepositRepositoryInterface {
    public _exists = false

    private _deposits: {
        [index: string]: Deposit
    } = {}

    create(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    save(deposit: Deposit): void {
        this._deposits[deposit.id.toValue()] = deposit
    }

    exists(contractId: string): Promise<boolean> {
        return Promise.resolve(this._exists)
    }

    getById(id: string): Promise<Deposit | null> {
        return Promise.resolve(this._deposits[id]?? null)
    }

    getByExternalId(externalId: string): Promise<Deposit | null> {
        for (const deposit of Object.values(this._deposits)) {
            if (deposit._externalContract.idString === externalId) {
                return Promise.resolve(deposit)
            }
        }

        return Promise.resolve(null)
    }

    getWaitingToRedeem(): Promise<Deposit[]> {
        return Promise.resolve([])
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
