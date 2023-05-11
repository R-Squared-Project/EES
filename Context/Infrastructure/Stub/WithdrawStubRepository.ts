import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw, { STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN } from "context/Domain/Withdraw";
import Deposit from "context/Domain/Deposit";

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

    getById(id: string): Promise<Withdraw | null> {
        return Promise.resolve(this._withdraws[id] ?? null);
    }

    getByRequestId(requestId: string): Promise<Withdraw | null> {
        for (const withdraw of Object.values(this._withdraws)) {
            if (withdraw.withdrawRequest.id.toString() === requestId) {
                return Promise.resolve(withdraw);
            }
        }

        return Promise.resolve(null);
    }

    getByTxHash(txHash: string): Promise<Withdraw | null> {
        for (const withdraw of Object.values(this._withdraws)) {
            if (withdraw.externalContract && withdraw.externalContract.txHash === txHash) {
                return Promise.resolve(withdraw);
            }
        }

        return Promise.resolve(null);
    }
}
