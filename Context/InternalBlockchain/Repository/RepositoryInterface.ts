import Contract from "../HtlcContract";
import OperationRedeem from "../OperationRedeem";
import OperationBurn from "context/InternalBlockchain/OperationBurn";
import OperationRefund from "context/InternalBlockchain/OperationRefund";
import Transaction from "context/InternalBlockchain/Transaction";

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
    getBurnOperations: (account: string) => Promise<OperationBurn[]>;
    getAccountHistory: (account: string) => Promise<Transaction[]>;
}
