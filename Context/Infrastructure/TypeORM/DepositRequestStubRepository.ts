import DepositRequest from "../../Domain/DepositRequest";
import DepositRequestRepositoryInterface from "../../Domain/DepositRequestRepositoryInterface";

export default class DepositRequestStubRepository implements DepositRequestRepositoryInterface {
    private _depositRequests: {
        [index: string]: DepositRequest
    } = {}

    create(depositRequest: DepositRequest): void {
        this._depositRequests[depositRequest.id.toValue()] = depositRequest
    }

    get size(): number {
        return Object.values(this._depositRequests).length
    }
}
