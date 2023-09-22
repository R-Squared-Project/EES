import WithdrawRepositoryInterface from "context/Domain/WithdrawRepositoryInterface";
import Withdraw, {
    STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN,
    STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN,
    STATUS_REDEEMED,
    STATUS_SEND_IN_REPLY,
} from "context/Domain/Withdraw";

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
            if (withdraw.txHash === txHash) {
                return Promise.resolve(withdraw);
            }
        }

        return Promise.resolve(null);
    }

    getByRedeemTxHash(txHash: string): Promise<Withdraw | null> {
        for (const withdraw of Object.values(this._withdraws)) {
            if (withdraw.externalBlockchainRedeemTxHash === txHash) {
                return Promise.resolve(withdraw);
            }
        }

        return Promise.resolve(null);
    }

    async getByExternalContractId(contractId: string): Promise<Withdraw | null> {
        for (const key in this._withdraws) {
            if (
                this._withdraws[key] instanceof Withdraw &&
                this._withdraws[key].externalContract?.idString === contractId
            ) {
                return this._withdraws[key];
            }
        }

        return null;
    }

    getByRedeemStatus(): Promise<Withdraw[]> {
        const withdraws = Object.values(this._withdraws).filter((withdraw: Withdraw) => {
            return withdraw.status === STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN;
        });

        return Promise.resolve(withdraws);
    }

    getByInternalContractId(contractId: string): Promise<Withdraw | null> {
        for (const withdraw of Object.values(this._withdraws)) {
            if (withdraw.internalContract?.idString === contractId) {
                return Promise.resolve(withdraw);
            }
        }

        return Promise.resolve(null);
    }

    getAllRedeemed(): Promise<Withdraw[]> {
        const withdraws = Object.values(this._withdraws).filter((withdraw: Withdraw) => {
            return withdraw.status === STATUS_REDEEMED;
        });

        return Promise.resolve(withdraws);
    }

    getAllReadyToRefund(): Promise<Withdraw[]> {
        const withdraws = Object.values(this._withdraws).filter((withdraw: Withdraw) => {
            return withdraw.status === STATUS_SEND_IN_REPLY;
        });

        return Promise.resolve(withdraws);
    }

    getByRefundTxHash(txHash: string): Promise<Withdraw | null> {
        for (const withdraw of Object.values(this._withdraws)) {
            if (withdraw.externalBlockchainRefundTxHash === txHash) {
                return Promise.resolve(withdraw);
            }
        }

        return Promise.resolve(null);
    }
}
