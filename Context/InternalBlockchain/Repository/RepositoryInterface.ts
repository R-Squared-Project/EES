import Contract from "../HtlcContract";
import OperationRedeem from "../OperationRedeem";
import OperationRefund from "context/InternalBlockchain/OperationRefund";

export default interface RepositoryInterface {
    createContract: (
        externalId: string,
        accountToName: string,
        amount: string,
        hashLock: string,
        timeLock: number
    ) => void;
    getIncomingContracts: (start: string) => Promise<Contract[]>;
    getRedeemOperations: (account: string) => Promise<OperationRedeem[]>;
    getRefundOperations: (account: string) => Promise<OperationRefund[]>;
    disconnect: () => void;
    burnAsset: (amount: string) => void;
    getAsset: () => Promise<any>;
}
