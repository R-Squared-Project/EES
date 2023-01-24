export default interface RepositoryInterface {
    createContract: (externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) => void
    disconnect: () => void
}
