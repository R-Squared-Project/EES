import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";
import {EventData} from "web3-eth-contract";

export default class StubRepository implements RepositoryInterface {
    public _txIncluded = true
    public _contract: Contract | null = null

    async txIncluded(txHash: string): Promise<boolean> {
        return this._txIncluded
    }

    async load(txHash: string, contractId: string): Promise<Contract | null> {
        return this._contract
    }

    getLastBlockNumber(): Promise<number> {
        return Promise.resolve(0);
    }

    loadEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return Promise.resolve([]);
    }

    reset() {
        this._txIncluded = true
        this._contract = null
    }
}
