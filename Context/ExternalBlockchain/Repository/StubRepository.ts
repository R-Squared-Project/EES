import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";
import { EventData } from "web3-eth-contract";
import { BlockTransactionString, TransactionReceipt } from "web3-eth";
import * as Errors from "context/ExternalBlockchain/Errors";
import { Map } from "immutable";

interface RedeemRequest {
    contractId: string;
    secret: string;
    receiver: string;
}

export default class StubRepository implements RepositoryInterface {
    public _txIncluded = true;
    public _contract: Contract | null = null;
    public _error: Errors.ExternalBlockchainError | null = null;
    public _redeemedRequests: RedeemRequest[] = [];
    public _redeemTxHash: string | null = null;
    public _transactionReceipt: TransactionReceipt | null = null;
    public _lastBlockNumber = 100;

    async txIncluded(txHash: string): Promise<boolean> {
        return this._txIncluded;
    }

    async loadDepositContract(txHash: string, contractId: string): Promise<Contract | null> {
        return this._contract;
    }

    async loadWithdrawContract(txHash: string, contractId: string): Promise<Contract | null> {
        return this._contract;
    }

    getLastBlockNumber(): Promise<number> {
        return Promise.resolve(this._lastBlockNumber);
    }

    async getBlock(number: number): Promise<BlockTransactionString | null> {
        //@ts-ignore
        return {};
    }

    loadDepositHTLCNewEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    loadWithdrawHTLCNewEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    async redeem(contractId: string, secret: string, receiver: string): Promise<string> {
        this._redeemedRequests.push({
            contractId,
            secret,
            receiver,
        });

        return this._redeemTxHash as string;
    }

    getAsset(): Map<string, number> {
        return Map<string, number>({ precision: 18 });
    }

    reset() {
        this._txIncluded = true;
        this._contract = null;
    }

    loadDepositHTLCRedeemEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    loadWithdrawHTLCRedeemEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
        return this._transactionReceipt ? Promise.resolve(this._transactionReceipt) : Promise.reject();
    }

    getGasPrice(): Promise<string> {
        return Promise.resolve("300");
    }

    createWithdrawHTLC(receiver: string, hashlock: string, timelock: number, amount: string): Promise<string> {
        return Promise.resolve("");
    }

    refund(contractId: string): Promise<string> {
        return Promise.resolve("");
    }

    loadWithdrawHTLCRefundEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    loadDepositHTLCRefundEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    getFee(): Promise<number> {
        return Promise.resolve(0);
    }

    setFee(fee: number): Promise<string> {
        return Promise.resolve("");
    }

    rotateProviders(): void {}
}
