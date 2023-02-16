import DepositRequest from "context/Domain/DepositRequest";
import DepositRequestRepositoryInterface from "context/Domain/DepositRequestRepositoryInterface";
import HashLock from "context/Domain/ValueObject/HashLock";

export default class DepositRequestRepository implements DepositRequestRepositoryInterface {
    private _depositRequests: {
        [index: string]: DepositRequest
    } = {}

    create(depositRequest: DepositRequest): void {
        this._depositRequests[depositRequest.id.toValue()] = depositRequest
    }

    load(hashLock: HashLock): Promise<DepositRequest | null> {
        const depositRequest = Object.values(this._depositRequests).find((depositRequest: DepositRequest) => {
            return (Reflect.get(depositRequest, '_hashLock') as HashLock).equals(hashLock)
        })

        return Promise.resolve(depositRequest ?? null)
    }

    get size(): number {
        return Object.values(this._depositRequests).length
    }

    reset() {
        this._depositRequests = {}
    }
}
