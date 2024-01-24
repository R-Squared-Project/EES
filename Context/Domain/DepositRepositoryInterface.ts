import Deposit from "./Deposit";

export default interface DepositRepositoryInterface {
    create: (deposit: Deposit) => void
    save: (deposit: Deposit) => void
    exists: (contractId: string) => Promise<boolean>
    getById: (id: string) => Promise<Deposit | null>
    getByRequestId: (requestId: string) => Promise<Deposit | null>
    getByTxHash: (externalId: string) => Promise<Deposit | null>
    getWaitingToRedeem: () => Promise<Deposit[]>
    getOverdueTimeLock: () => Promise<Deposit[]>
    getBurned: () => Promise<Deposit[]>
    getByRedeemTxHash: (txHash: string) => Promise<Deposit | null>
    getByBurnTxHash: (txHash: string) => Promise<Deposit | null>
    getByContractId: (contractId: string) => Promise<Deposit | null>
    getByRequestIds: (requestIds: string[]) => Promise<Deposit[]>
}
