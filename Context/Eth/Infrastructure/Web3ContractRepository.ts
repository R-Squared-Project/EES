import Web3 from "web3";
import {Contract as ContractWeb3} from "web3-eth-contract";
import ContractRepositoryInterface from "../Domain/ContractRepositoryInterface";
import Contract from "../Domain/Contract";
import HashedTimelockAbi from "../../../src/assets/abi/HashedTimelock.json";
import {AbiItem} from "web3-utils";
import dayjs from "dayjs";

export default class Web3ContractRepository implements ContractRepositoryInterface {
    private web3: Web3
    private contract: ContractWeb3

    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(
            `https://${process.env.ETH_NETWORK_NAME}.infura.io/v3/${process.env.INFURA_API_KEY}`
        ))

        this.contract = new this.web3.eth.Contract(HashedTimelockAbi as AbiItem[], process.env.ETH_CONTRACT_ADDRESS)
    }

    async isTxIncluded(txHash: string): Promise<boolean> {
        const tx = await this.web3.eth.getTransaction(txHash)

        return tx.blockNumber !== null;
    }

    async load(txHash: string, contractId: string): Promise<Contract> {
        const contractData = await this.contract.methods.getContract(contractId).call({
            // from: ''
        })

        const tx = await this.loadTx(txHash)
        const block = await this.loadBlock(tx.blockNumber as number)

        return new Contract(
            contractId,
            contractData.sender,
            contractData.receiver,
            contractData.amount,
            contractData.hashlock,
            contractData.timelock,
            contractData.withdrawn,
            contractData.refunded,
            contractData.preimage,
            dayjs.unix(block.timestamp as number)
        )
    }

    private async loadTx(txHash: string) {
        return await this.web3.eth.getTransaction(txHash)
    }

    private async loadBlock(blockNumber: number) {
        return await this.web3.eth.getBlock(blockNumber)
    }
}