import Withdraw from "./Withdraw";

export default interface WithdrawRepositoryInterface {
    save: (withdraw: Withdraw) => void;
    getAllForCheck: () => Promise<Withdraw[]>;
    getByTxHash: (txHash: string) => Promise<Withdraw | null>;
    getByHashLock: (hashLock: string) => Promise<Withdraw | null>;
    getById: (id: string) => Promise<Withdraw | null>;
    getByRequestId: (requestId: string) => Promise<Withdraw | null>;
    getByRedeemTxHash: (txHash: string) => Promise<Withdraw | null>;
    getByExternalContractId: (contractId: string) => Promise<Withdraw | null>;
    getByRedeemStatus: () => Promise<Withdraw[]>;
    getByInternalContractId: (contractId: string) => Promise<Withdraw | null>;
    getAllRedeemed: () => Promise<Withdraw[]>;
    getAllReadyToRefund: () => Promise<Withdraw[]>;
    getAllRefundedReadyToBurn: () => Promise<Withdraw[]>;
    getByRefundTxHash: (txHash: string) => Promise<Withdraw | null>;
}
