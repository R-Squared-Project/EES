import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw, { STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN } from "context/Domain/Withdraw";
import DepositRequest from "context/Domain/DepositRequest";
import HashLock from "context/Domain/ValueObject/HashLock";

export default class WithdrawStubRepository implements WithdrawRepositoryInterface {
    public _exists = false;
    private _withdraws: {
        [index: string]: Withdraw;
    } = {};
    save(withdraw: Withdraw): void {
        this._withdraws[withdraw.id.toValue()] = withdraw;
    }

    getAllForCheck(): Promise<Withdraw[]> {
        const withdraws = Object.values(this._withdraws).filter((withdraw: Withdraw) => {
            return withdraw.status === STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN;
        });

        return Promise.resolve(withdraws);
    }
}
