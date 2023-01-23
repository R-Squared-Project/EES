import Contract from "context/InternalBlockchain/Contract";

export default interface RepositoryInterface {
    createContract: (externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) => void
    getIncomingContracts: (accountFromName: string, start: string) => Promise<Contract[]>
    disconnect: () => void
}
