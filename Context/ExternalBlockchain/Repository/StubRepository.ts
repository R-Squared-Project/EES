import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";
import {EventData} from "web3-eth-contract";
import {BlockTransactionString, TransactionReceipt} from "web3-eth";
import * as Errors from "context/ExternalBlockchain/Errors";

interface RedeemRequest {
    contractId: string
    secret: string
    receiver: string
}

export default class StubRepository implements RepositoryInterface {
    public _txIncluded = true
    public _contract: Contract | null = null
    public _error: Errors.ExternalBlockchainError | null = null
    public _redeemedRequests: RedeemRequest[] = []
    public _redeemTxHash: string | null = null
    public _transactionReceipt: TransactionReceipt | null = null
    async txIncluded(txHash: string): Promise<boolean> {
        return this._txIncluded
    }

    async load(txHash: string, contractId: string): Promise<Contract | null> {
        return this._contract
    }

    getLastBlockNumber(): Promise<number> {
        return Promise.resolve(0);
    }

    async getBlock(number: number): Promise<BlockTransactionString | null> {
        //@ts-ignore
        return {}
    }

    loadHTLCNewEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    async redeem(contractId: string, secret: string, receiver: string): Promise<string> {
        this._redeemedRequests.push({
            contractId, secret, receiver
        })

        return this._redeemTxHash as string
    }

    reset() {
        this._txIncluded = true
        this._contract = null
    }

    loadHTLCRedeemEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
        return this._transactionReceipt ? Promise.resolve(this._transactionReceipt) : Promise.reject();
    }
}
