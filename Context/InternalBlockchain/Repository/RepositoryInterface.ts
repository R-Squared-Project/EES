export default interface RepositoryInterface {
    createContract: (accountToName: string, amount: number, hashLock: string, timeLock: number) => void
}
