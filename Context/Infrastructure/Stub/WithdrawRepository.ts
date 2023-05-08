import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw from "context/Domain/Withdraw";

export default class WithdrawRepository implements WithdrawRepositoryInterface {
    public _exists = false;
    private _withdraws: {
        [index: string]: Withdraw;
    } = {};
    save(withdraw: Withdraw): void {
        this._withdraws[withdraw.id.toValue()] = withdraw;
    }
}
