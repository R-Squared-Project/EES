import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {BlockTransactionString} from "web3-eth";
import {Contract as ContractWeb3, EventData} from "web3-eth-contract";
import HashedTimeLockAbi from "../../../src/assets/abi/HashedTimelock.json";
import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";
import config from "context/config";
import * as Errors from "context/ExternalBlockchain/Errors";

export default class EthereumRepository implements RepositoryInterface {
    private _web3: Web3
    private _contract: ContractWeb3

    constructor() {
        this._web3 = new Web3(new Web3.providers.HttpProvider(
            `https://${config.eth.network as string}.infura.io/v3/${config.eth?.providers.infura.api_key}`
        ))

        this._contract = new this._web3.eth.Contract(HashedTimeLockAbi as AbiItem[], config.eth?.contract_address)
    }

    async txIncluded(txHash: string): Promise<boolean> {
        const tx = await this._web3.eth.getTransaction(txHash)
        const txReceipt = await this._web3.eth.getTransactionReceipt(txHash)
        const log = txReceipt.logs[0]

        //log.removed doesn't exist in the interface
        //@ts-ignore
        return tx.blockNumber !== null && txReceipt.status && !log.removed;
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

    async getBlock(number: number): Promise<BlockTransactionString | null> {
        return await this._web3.eth.getBlock(number)
    }

    async loadHTLCNewEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._contract.getPastEvents(
            'LogHTLCNew',
            {
                fromBlock: fromBlock,
                toBlock
            }
        )
    }

    async redeem(contractId: string, secret: string, receiver: string): Promise<string> {
        let gas: number

        try {
            gas = await this._contract.methods.withdraw(contractId, secret).estimateGas({
                from: receiver
            })
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError()
            }

            throw new Errors.RedeemUnexpectedError(contractId, e.message)
        }

        const tx = {
            from: receiver,
            to: this._contract.options.address,
            gas,
            data: this._contract.methods.withdraw(contractId, secret).encodeABI()
        };

        const signedTx = await this._web3.eth.accounts.signTransaction(tx, config.eth.private_key);

        try {
            const result = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

            return result.transactionHash
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError()
            }

            throw new Errors.RedeemUnexpectedError(contractId, e.message)
        }
    }


    private async loadTx(txHash: string) {
        return await this._web3.eth.getTransaction(txHash)
    }

    private async loadBlock(blockNumber: number) {
        return await this._web3.eth.getBlock(blockNumber)
    }
}
