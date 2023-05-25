import Contract from "../HtlcContract";
import OperationRedeem from "../OperationRedeem";
import OperationBurn from "context/InternalBlockchain/OperationBurn";
import OperationRefund from "context/InternalBlockchain/OperationRefund";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";
import { Map } from "immutable";

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
    getBurnOperations: (account: string) => Promise<OperationBurn[]>;
    getInternalAsset: () => Promise<Map<string, any>>;
    getAsset: (assetId: string) => Promise<Map<string, any>>;
    getAccountHistory: (lastProcessedAccountHistoryOperation: string) => Promise<WithdrawTransaction[]>;
    getAccount(accountId: string): Promise<Map<string, any>>;
    getEesAccount: () => Promise<Map<string, any>>;
    getObject: (objectId: string) => Promise<Map<string, any>>;
    getLastIrreversibleBlockNumber: () => Promise<number>;
}
