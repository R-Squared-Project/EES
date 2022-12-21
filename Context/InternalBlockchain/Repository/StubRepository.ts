import RepositoryInterface from "./RepositoryInterface";

export default class StubRepository implements RepositoryInterface {
    createContract(accountToName: string, amount: number, hashLock: string, timeLock: number) {
        return Promise.resolve(null);
    }
}
