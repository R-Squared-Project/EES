import RepositoryInterface from "./RepositoryInterface";
import Contract from "context/InternalBlockchain/Contract";

interface ContractInfo {
    externalId: string,
    accountToName: string,
    amount: number,
    hashLock: string,
    timeLock: number
}

export default class StubRepository implements RepositoryInterface {
    private _newContracts: ContractInfo[] = []
    private _internalContracts: Contract[] = []

    createContract(externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) {
        this._newContracts.push({externalId, accountToName, amount, hashLock, timeLock})
    }

    get contracts(): ContractInfo[] {
        return this._newContracts;
    }

    public addInternalContract(contract: Contract) {
        this._internalContracts.push(contract)
    }

    getIncomingContracts(accountFromName: string, start: string): Promise<Contract[]> {
        return Promise.resolve(this._internalContracts)
    }

    public async disconnect() {
    }
}
