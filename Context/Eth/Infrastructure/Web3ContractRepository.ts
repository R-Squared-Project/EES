import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {Contract as ContractWeb3} from "web3-eth-contract";
import dayjs from "dayjs";
import config from "../config";
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
            `https://${config.eth.network}.infura.io/v3/${config.eth_provider.infura.api_key}`
        ))

        this.contract = new this.web3.eth.Contract(HashedTimelockAbi as AbiItem[], config.eth.contract_address)
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

        const signedTx = await this.web3.eth.accounts.signTransaction(tx, config.eth.private_key);
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