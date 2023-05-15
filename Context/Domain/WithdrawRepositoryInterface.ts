import Withdraw from "./Withdraw";

export default interface WithdrawRepositoryInterface {
    save: (withdraw: Withdraw) => void;
    getAllForCheck: () => Promise<Withdraw[]>;
    getByTxHash: (txHash: string) => Promise<Withdraw | null>;
    getById: (id: string) => Promise<Withdraw | null>;
    getByRequestId: (requestId: string) => Promise<Withdraw | null>;
}
