import WithdrawRequest, { STATUS_CREATED } from "context/Domain/WithdrawRequest";
import WithdrawRequestRepositoryInterface from "context/Domain/WithdrawRequestRepositoryInterface";

export default class WithdrawRequestRepository implements WithdrawRequestRepositoryInterface {
    private _withdrawRequests: {
        [index: string]: WithdrawRequest;
    } = {};

    save(withdrawRequest: WithdrawRequest): void {
        this._withdrawRequests[withdrawRequest.idString] = withdrawRequest;
    }

    create(withdrawRequest: WithdrawRequest): void {
        this._withdrawRequests[withdrawRequest.id.toValue()] = withdrawRequest;
    }

    get size(): number {
        return Object.values(this._withdrawRequests).length;
    }

    reset() {
        this._withdrawRequests = {};
    }

    findAllCreated(): Promise<WithdrawRequest[]> {
        const withdrawRequests = Object.values(this._withdrawRequests).filter((withdrawRequest: WithdrawRequest) => {
            return withdrawRequest.status == STATUS_CREATED;
        });

        return Promise.resolve(withdrawRequests);
    }
}
