//@ts-ignore
import { ChainTypes } from "@r-squared/rsquared-js";
import WithdrawTransaction from "context/InternalBlockchain/WithdrawTransaction";

export enum OperationType {
    Create,
    Redeem,
    Refund,
}

export class WithdrawTransactionsCollection {
    private _transactions: WithdrawTransaction[] = [];

    constructor(private eesAccountId: string, private operationType: OperationType) {}

    get transactions(): WithdrawTransaction[] {
        return this._transactions;
    }

    public add(operation: any) {
        if (this.isTransfer(operation) && this.operationType == OperationType.Create) {
            this.addTransferOperation(operation);

            return;
        }

        if (this.isHtlcCreate(operation) && this.operationType == OperationType.Create) {
            this.addHtlcCreateOperation(operation);

            return;
        }

        if (this.isHtlcRedeem(operation) && this.operationType == OperationType.Redeem) {
            this.addHtlcRedeemOperation(operation);
        }

        if (this.isHtlcRefund(operation) && this.operationType == OperationType.Refund) {
            this.addHtlcRefundOperation(operation);
        }

    }

    private isTransfer(operation: any) {
        if (operation.op[0] != ChainTypes.operations.transfer) {
            return false;
        }

        if (operation.op[1].to != this.eesAccountId) {
            return false;
        }

        return true;
    }

    private addTransferOperation(operation: any) {
        const transaction = this.getTransaction(operation);

        transaction.transactionInBlock = operation.trx_in_block;
        transaction.transferId = operation.id;
        transaction.blockNumber = operation.block_num;
        transaction.transferSender = operation.op[1].from;
        transaction.transferReceiver = operation.op[1].to;
    }

    private isHtlcCreate(operation: any) {
        if (operation.op[0] != ChainTypes.operations.htlc_create) {
            return false;
        }

        if (operation.op[1].to != this.eesAccountId) {
            return false;
        }

        return true;
    }

    private isHtlcRedeem(operation: any) {
        if (operation.op[0] != ChainTypes.operations.htlc_redeemed) {
            return false;
        }

        if (operation.op[1].to != this.eesAccountId) {
            return false;
        }

        return true;
    }

    private isHtlcRefund(operation: any) {
        if (operation.op[0] != ChainTypes.operations.htlc_refund) {
            return false;
        }

        if (operation.op[1].to != this.eesAccountId) {
            return false;
        }

        return true;
    }

    private addHtlcCreateOperation(operation: any) {
        const transaction = this.getTransaction(operation);

        transaction.transactionInBlock = operation.trx_in_block;
        transaction.denormalizedAmount = operation.op[1].amount.amount;
        transaction.blockNumber = operation.block_num;
        transaction.htlcCreateAssetId = operation.op[1].amount.asset_id;
        transaction.hashLock = operation.op[1].preimage_hash[1];
        transaction.hashMethod = operation.op[1].preimage_hash[0];
        transaction.htlcCreateId = operation.id;
        transaction.htlcId = operation.result[1];
        transaction.htlcCreateReceiver = operation.op[1].to;
        transaction.htlcCreateSender = operation.op[1].from;
        transaction.timeLock = operation.op[1].claim_period_seconds;
    }

    private getTransaction(operation: any) {
        const lastTransaction =
            this._transactions.length > 0 ? this._transactions[this._transactions.length - 1] : null;
        const transactionId = operation.block_num + "_" + operation.trx_in_block;
        let transaction: WithdrawTransaction;

        if (lastTransaction && lastTransaction.transactionId == transactionId) {
            transaction = lastTransaction;
        } else {
            transaction = new WithdrawTransaction(transactionId);
            this._transactions.push(transaction);
        }

        return transaction;
    }

    private addHtlcRedeemOperation(operation: any) {
        const transaction = this.getTransaction(operation);
        transaction.blockNumber = operation.block_num;
        transaction.htlcId = operation.op[1].htlc_id;
    }

    private addHtlcRefundOperation(operation: any) {
        const transaction = this.getTransaction(operation);
        transaction.blockNumber = operation.block_num;
        transaction.htlcId = operation.op[1].htlc_id;
    }
}
