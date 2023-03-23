import Contract from "../Contract";
import {BlockTransactionString} from "web3-eth";
import {EventData} from "web3-eth-contract";

export default interface RepositoryInterface {
    txIncluded: (txHash: string) => Promise<boolean>
    load: (txHash: string, contractId: string) => Promise<Contract | null>
    getLastBlockNumber: () => Promise<number>
    getBlock: (number: number) => Promise<BlockTransactionString | null>
    loadHTLCNewEvents: (fromBlock: number, toBlock: number) => Promise<EventData[]>
    loadHTLCRedeemEvents: (fromBlock: number, toBlock: number) => Promise<EventData[]>
    redeem: (contractId: string, secret: string, receiver: string) => Promise<string>
}
