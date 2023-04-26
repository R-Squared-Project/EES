import Withdraw from "./Withdraw";

export default interface WithdrawRepositoryInterface {
    create: (withdraw: Withdraw) => void;
    save: (withdraw: Withdraw) => void;
    exists: (contractId: string) => Promise<boolean>;
    getById: (id: string) => Promise<Withdraw | null>;
    getByRequestId: (requestId: string) => Promise<Withdraw | null>;
    getByTxHash: (externalId: string) => Promise<Withdraw | null>;
    getWaitingToRedeem: () => Promise<Withdraw[]>;
    getOverdueTimeLock: () => Promise<Withdraw[]>;
    getByRedeemTxHash: (txHash: string) => Promise<Withdraw | null>;
}
