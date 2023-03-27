import RepositoryInterface from "./RepositoryInterface";
import Contract from "context/InternalBlockchain/HtlcContract";
import OperationRedeem from "../OperationRedeem";

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
    private _operationsRedeem: OperationRedeem[] = []

    createContract(externalId: string, accountToName: string, amount: number, hashLock: string, timeLock: number) {
        this._newContracts.push({externalId, accountToName, amount, hashLock, timeLock})
    }

    get contracts(): ContractInfo[] {
        return this._newContracts;
    }

    public addInternalContract(contract: Contract) {
        this._internalContracts.push(contract)
    }

    async getIncomingContracts(start: string): Promise<Contract[]> {
        return this._internalContracts
    }

    async addRedeemOperation(operationRedeem: OperationRedeem) {
        this._operationsRedeem.push(operationRedeem)
    }

    async getRedeemOperations(account: string): Promise<OperationRedeem[]> {
        return this._operationsRedeem
    }

    public async disconnect() {
        return undefined
    }

    burnAsset(amount: number): void {
    }
}
