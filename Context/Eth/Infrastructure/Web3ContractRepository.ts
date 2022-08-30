import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {Contract as ContractWeb3} from "web3-eth-contract";
import dayjs from "dayjs";
import ContractRepositoryInterface from "../Domain/ContractRepositoryInterface";
import Contract from "../Domain/Contract";
import HashedTimelockAbi from "../../../src/assets/abi/HashedTimelock.json";
import {RedeemUnexpectedError} from "../Domain/Errors";

export default class Web3ContractRepository implements ContractRepositoryInterface {
    private web3: Web3
    private contract: ContractWeb3

    constructor(
        private address: string,
        private privateKey: string
    ) {
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
            from: this.address
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

    async redeem(contractId: string, secret: string): Promise<string | RedeemUnexpectedError> {
        let gas: number

        try {
            gas = await this.contract.methods.withdraw(contractId, secret).estimateGas({
                from: this.address
            })
        } catch (e) {
            return new RedeemUnexpectedError(contractId, e.message)
        }

        const tx = {
            from: this.address,
            to: this.contract.options.address,
            gas,
            data: this.contract.methods.withdraw(contractId, secret).encodeABI()
        };

        const signedTx = await this.web3.eth.accounts.signTransaction(tx, process.env.ETH_PRIVATE_KEY as string);
        const result = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

        return result.transactionHash
    }

    private async loadTx(txHash: string) {
        return await this.web3.eth.getTransaction(txHash)
    }

    private async loadBlock(blockNumber: number) {
        return await this.web3.eth.getBlock(blockNumber)
    }
}