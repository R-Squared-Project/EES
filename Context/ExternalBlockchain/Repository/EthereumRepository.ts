import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {Contract as ContractWeb3, EventData} from "web3-eth-contract";
import HashedTimelockAbi from "../../../src/assets/abi/HashedTimelock.json";
import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";
import config from "context/config";

export default class EthereumRepository implements RepositoryInterface {
    private _web3: Web3
    private _contract: ContractWeb3

    constructor() {
        this._web3 = new Web3(new Web3.providers.HttpProvider(
            `https://${config.eth?.network as string}.infura.io/v3/${config.eth?.providers.infura.api_key}`
        ))

        this._contract = new this._web3.eth.Contract(HashedTimelockAbi as AbiItem[], config.eth?.contract_address)
    }

    async txIncluded(txHash: string): Promise<boolean> {
        const tx = await this._web3.eth.getTransaction(txHash)

        return tx.blockNumber !== null;
    }

    async load(txHash: string, contractId: string): Promise<Contract | null> {
        const contractData = await this._contract.methods.getContract(contractId).call({
            from: config.eth.contract_address
        })

        return new Contract(
            contractId,
            contractData.sender,
            contractData.receiver,
            contractData.amount,
            contractData.hashlock,
            contractData.timelock,
            contractData.withdrawn,
            contractData.refunded,
            contractData.preimage
        )
    }

    async getLastBlockNumber(): Promise<number> {
        return await this._web3.eth.getBlockNumber();
    }

    async loadEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._contract.getPastEvents(
            'LogHTLCNew',
            {
                // fromBlock: 7965089,
                fromBlock: fromBlock,
                toBlock
            }
        )
    }


    private async loadTx(txHash: string) {
        return await this._web3.eth.getTransaction(txHash)
    }

    private async loadBlock(blockNumber: number) {
        return await this._web3.eth.getBlock(blockNumber)
    }
}
