import RepositoryInterface from "./RepositoryInterface";

interface ContractInfo {
    externalId: string,
    accountToName: string,
    amount: number,
    hashLock: string,
    timeLock: number
}

export default class StubRepository implements RepositoryInterface {
    private _contracts: ContractInfo[] = []

    createContract(externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) {
        this._contracts.push({externalId, accountToName, amount, hashLock, timeLock})
    }

    public async disconnect() {
    }

    get contracts(): ContractInfo[] {
        return this._contracts;
    }
}
