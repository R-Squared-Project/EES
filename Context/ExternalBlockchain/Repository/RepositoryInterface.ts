import Contract from "../Contract";
import {EventData} from "web3-eth-contract";

export default interface RepositoryInterface {
    txIncluded: (txHash: string) => Promise<boolean>
    load: (txHash: string, contractId: string) => Promise<Contract | null>
    getLastBlockNumber: () => Promise<number>
    loadHTLCNewEvents: (fromBlock: number, toBlock: number) => Promise<EventData[]>
}
