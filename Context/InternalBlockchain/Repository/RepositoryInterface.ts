import Contract from "../HtlcContract";
import OperationRedeem from "../OperationRedeem";

export default interface RepositoryInterface {
    createContract: (externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) => void
    getIncomingContracts: (start: string) => Promise<Contract[]>
    getRedeemOperations: (account: string) => Promise<OperationRedeem[]>
    disconnect: () => void
    burnAsset: (amount: number) => void
}
