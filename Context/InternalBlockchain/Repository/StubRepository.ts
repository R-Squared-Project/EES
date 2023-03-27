import RepositoryInterface from "./RepositoryInterface";
import Contract from "context/InternalBlockchain/HtlcContract";
import OperationRedeem from "../OperationRedeem";
import OperationBurn from "context/InternalBlockchain/OperationBurn";
import OperationRefund from "context/InternalBlockchain/OperationRefund";
import { Map } from "immutable";

interface ContractInfo {
    externalId: string;
    accountToName: string;
    amount: string;
    hashLock: string;
    timeLock: number;
}

const ASSET_PRECISION = 4;

export default class StubRepository implements RepositoryInterface {
    private _newContracts: ContractInfo[] = [];
    private _internalContracts: Contract[] = [];
    private _operationsRedeem: OperationRedeem[] = [];
    private _operationsBurn: OperationBurn[] = [];

    createContract(externalId: string, accountToName: string, amount: string, hashLock: string, timeLock: number) {
        this._newContracts.push({ externalId, accountToName, amount, hashLock, timeLock });
    }

    get contracts(): ContractInfo[] {
        return this._newContracts;
    }

    public addInternalContract(contract: Contract) {
        this._internalContracts.push(contract);
    }

    async getIncomingContracts(start: string): Promise<Contract[]> {
        return this._internalContracts;
    }

    getRefundOperations(account: string): Promise<OperationRefund[]> {
        return Promise.resolve([]);
    }

    async addRedeemOperation(operationRedeem: OperationRedeem) {
        this._operationsRedeem.push(operationRedeem);
    }

    async getRedeemOperations(account: string): Promise<OperationRedeem[]> {
        return this._operationsRedeem;
    }

    public async disconnect() {
        return undefined;
    }

    burnAsset(amount: string): void {
        return;
    }

    async getAsset(): Promise<any> {
        return Map<string, number>({ precision: ASSET_PRECISION });
    }

    async addBurnOperation(operationBurn: OperationBurn) {
        this._operationsBurn.push(operationBurn)
    }

    async getBurnOperations(account: string): Promise<OperationBurn[]> {
        return this._operationsBurn
    }
}
