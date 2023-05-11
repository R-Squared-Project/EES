import Withdraw from "./Withdraw";
import Deposit from "context/Domain/Deposit";

export default interface WithdrawRepositoryInterface {
    save: (withdraw: Withdraw) => void;
    getAllForCheck: () => Promise<Withdraw[]>;
    getByTxHash: (txHash: string) => Promise<Withdraw | null>;
    getById: (id: string) => Promise<Withdraw | null>;
    getByRequestId: (requestId: string) => Promise<Withdraw | null>;
}
