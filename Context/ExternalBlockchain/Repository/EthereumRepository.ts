import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BlockTransactionString, TransactionReceipt } from "web3-eth";
import { Contract as ContractWeb3, EventData } from "web3-eth-contract";
import DepositHashedTimeLockAbi from "../../../src/assets/abi/DepositHashedTimelock.json";
import WithdrawHashedTimeLockAbi from "../../../src/assets/abi/WithdrawHashedTimelock.json";
import RepositoryInterface from "./RepositoryInterface";
import Contract from "../Contract";
import config from "context/config";
import * as Errors from "context/ExternalBlockchain/Errors";
import { Injectable } from "@nestjs/common";
import { Map } from "immutable";
@Injectable()
export default class EthereumRepository implements RepositoryInterface {
    private _web3: Web3;
    private _depositContract: ContractWeb3;
    private _withdrawContract: ContractWeb3;

    constructor() {
        this._web3 = new Web3(
            new Web3.providers.HttpProvider(
                `https://${config.eth.network as string}.infura.io/v3/${config.eth?.providers.infura.api_key}`
            )
        );

        this._depositContract = new this._web3.eth.Contract(
            DepositHashedTimeLockAbi as AbiItem[],
            config.eth?.deposit_contract_address
        );
        this._withdrawContract = new this._web3.eth.Contract(
            WithdrawHashedTimeLockAbi as AbiItem[],
            config.eth?.withdraw_contract_address
        );
    }

    async txIncluded(txHash: string): Promise<boolean> {
        const tx = await this._web3.eth.getTransaction(txHash);
        const txReceipt = await this._web3.eth.getTransactionReceipt(txHash);
        const log = txReceipt.logs[0];

        //log.removed doesn't exist in the interface
        //@ts-ignore
        return tx.blockNumber !== null && txReceipt.status && !log.removed;
    }

    async loadDepositContract(txHash: string, contractId: string): Promise<Contract | null> {
        const contractData = await this._depositContract.methods.getContract(contractId).call({
            from: config.eth.deposit_contract_address,
        });

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
        );
    }

    async loadWithdrawContract(txHash: string, contractId: string): Promise<Contract | null> {
        const contractData = await this._withdrawContract.methods.getContract(contractId).call({
            from: config.eth.withdraw_contract_address,
        });

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
        );
    }

    async getLastBlockNumber(): Promise<number> {
        return await this._web3.eth.getBlockNumber();
    }

    async getBlock(number: number): Promise<BlockTransactionString | null> {
        return await this._web3.eth.getBlock(number);
    }

    async loadDepositHTLCNewEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._depositContract.getPastEvents("LogHTLCNew", {
            fromBlock: fromBlock,
            toBlock,
        });
    }

    async loadWithdrawHTLCNewEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._withdrawContract.getPastEvents("LogHTLCNew", {
            fromBlock: fromBlock,
            toBlock,
        });
    }

    async loadDepositHTLCRedeemEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._depositContract.getPastEvents("LogHTLCWithdraw", {
            fromBlock: fromBlock,
            toBlock,
        });
    }

    async loadWithdrawHTLCRedeemEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._withdrawContract.getPastEvents("LogHTLCWithdraw", {
            fromBlock: fromBlock,
            toBlock,
        });
    }

    async redeem(contractId: string, secret: string, receiver: string): Promise<string> {
        let gas: number;

        try {
            gas = await this._depositContract.methods.withdraw(contractId, secret).estimateGas({
                from: receiver,
            });
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw new Errors.RedeemUnexpectedError(contractId, e.message);
        }

        const tx = {
            from: receiver,
            to: this._depositContract.options.address,
            gas,
            data: this._depositContract.methods.withdraw(contractId, secret).encodeABI(),
        };

        const signedTx = await this._web3.eth.accounts.signTransaction(tx, config.eth.private_key);

        try {
            const result = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

            return result.transactionHash;
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw new Errors.RedeemUnexpectedError(contractId, e.message);
        }
    }

    async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
        return await this._web3.eth.getTransactionReceipt(txHash);
    }

    getAsset(): Map<string, number> {
        return Map<string, number>({ precision: 18 });
    }

    async getGasPrice(): Promise<string> {
        return await this._web3.eth.getGasPrice();
    }

    async createWithdrawHTLC(receiver: string, hashlock: string, timelock: number, amount: string): Promise<string> {
        let gas: number;

        try {
            gas = await this._withdrawContract.methods.newContract(receiver, hashlock, timelock).estimateGas({
                from: config.eth.receiver,
                value: amount,
            });
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw new Errors.ErrorEstimatingGas(receiver, e.message);
        }

        const tx = {
            from: config.eth.receiver,
            to: this._withdrawContract.options.address,
            gas,
            value: amount,
            data: this._withdrawContract.methods.newContract(receiver, hashlock, timelock).encodeABI(),
        };

        const signedTx = await this._web3.eth.accounts.signTransaction(tx, config.eth.private_key);

        try {
            const result = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

            return result.transactionHash;
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw new Errors.CreateWithdrawContractUnexpactedError(receiver, e.message);
        }
    }

    async refund(contractId: string): Promise<string> {
        let gas: number;

        try {
            gas = await this._withdrawContract.methods.refund(contractId).estimateGas({
                from: config.eth.receiver,
            });
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            if ((e as Error).message.indexOf("already refunded") > -1) {
                return "ALREADY_REFUNDED";
            }

            throw new Errors.RefundUnexpectedError(contractId, e.message);
        }

        const tx = {
            from: config.eth.receiver,
            to: config.eth.withdraw_contract_address,
            gas,
            data: this._withdrawContract.methods.refund(contractId).encodeABI(),
        };

        const signedTx = await this._web3.eth.accounts.signTransaction(tx, config.eth.private_key);

        try {
            const result = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

            return result.transactionHash;
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw new Errors.RefundUnexpectedError(contractId, e.message);
        }
    }

    async setFee(fee: number): Promise<string> {
        let gas: number;

        try {
            gas = await this._depositContract.methods.setFee(fee).estimateGas({
                from: config.eth.receiver,
            });
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw e;
        }

        const tx = {
            from: config.eth.receiver,
            to: config.eth.deposit_contract_address,
            gas,
            data: this._depositContract.methods.setFee(fee).encodeABI(),
        };

        const signedTx = await this._web3.eth.accounts.signTransaction(tx, config.eth.private_key);

        try {
            const result = await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

            return result.transactionHash;
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw e;
        }
    }

    async getFee(): Promise<number> {

        try {
            const result = await this._depositContract.methods.getFee().call({
                from: config.eth.deposit_contract_address,
            });

            return result as unknown as number;
        } catch (e) {
            if (e instanceof TypeError) {
                throw new Errors.ConnectionError();
            }

            throw e;
        }
    }

    private async loadTx(txHash: string) {
        return await this._web3.eth.getTransaction(txHash);
    }

    private async loadBlock(blockNumber: number) {
        return await this._web3.eth.getBlock(blockNumber);
    }

    async loadWithdrawHTLCRefundEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._withdrawContract.getPastEvents("LogHTLCRefund", {
            fromBlock: fromBlock,
            toBlock,
        });
    }

    async loadDepositHTLCRefundEvents(fromBlock: number, toBlock: number): Promise<EventData[]> {
        return await this._depositContract.getPastEvents("LogHTLCRefund", {
            fromBlock: fromBlock,
            toBlock,
        });
    }
}
