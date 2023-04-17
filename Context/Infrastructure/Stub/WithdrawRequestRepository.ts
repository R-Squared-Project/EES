import WithdrawRequest from "context/Domain/WithdrawRequest";
import HashLock from "context/Domain/ValueObject/HashLock";
import WithdrawRequestRepositoryInterface from "context/Domain/WithdrawRequestRepositoryInterface";

export default class WithdrawRequestRepository implements WithdrawRequestRepositoryInterface {
    private _withdrawRequests: {
        [index: string]: WithdrawRequest
    } = {}

    create(withdrawRequest: WithdrawRequest): void {
        this._withdrawRequests[withdrawRequest.id.toValue()] = withdrawRequest
    }

    load(hashLock: HashLock): Promise<WithdrawRequest | null> {
        const withdrawRequest = Object.values(this._withdrawRequests).find((withdrawRequest: WithdrawRequest) => {
            return (Reflect.get(withdrawRequest, '_hashLock') as HashLock).equals(hashLock)
        })

        return Promise.resolve(withdrawRequest ?? null)
    }

    get size(): number {
        return Object.values(this._withdrawRequests).length
    }

    reset() {
        this._withdrawRequests = {}
    }
}
