import { EntitySchema } from "typeorm";
import Withdraw from "context/Domain/Withdraw";
import UniqueEntityIDType from "context/Infrastructure/TypeORM/Type/UniqueEntityIDType";

const WithdrawEntity = new EntitySchema<Withdraw>({
    name: "Withdraw",
    tableName: "withdraw",
    target: Withdraw,
    relations: {
        withdrawRequest: {
            target: "WithdrawRequest",
            type: "one-to-one",
            joinColumn: {
                name: "withdraw_request_id",
                referencedColumnName: "idString",
            },
        },
        externalContract: {
            target: "ExternalContract",
            type: "one-to-one",
            nullable: false,
            joinColumn: {
                name: "external_contract_id",
                referencedColumnName: "idString",
            },
            cascade: ["insert"],
        },
        internalContract: {
            target: "InternalContract",
            type: "one-to-one",
            joinColumn: {
                name: "internal_contract_id",
                referencedColumnName: "idString",
            },
            cascade: ["insert"],
        },
    },
    columns: {
        id: UniqueEntityIDType,
        status: {
            name: "status",
            type: Number,
        },
        transferOperationId: {
            name: "transfer_operation_id",
            type: String,
        },
        htlcCreateOperationId: {
            name: "htlc_create_operation_id",
            type: String,
        },
        // @ts-ignore
        _createdAt: {
            name: "created_at",
            createDate: true,
        },
        errorMessage: {
            name: "error_message",
            type: String,
            nullable: true,
        },
        secret: {
            name: "secret",
            type: String,
            nullable: true,
        },
        hashlock: {
            name: "hashlock",
            type: String,
            nullable: true,
        },
        timelock: {
            name: "timelock",
            type: Number,
            nullable: true,
        },
        amountOfHTLC: {
            name: "amount_of_htlc",
            type: Number,
            nullable: true,
        },
        amountOfWithdrawalFee: {
            name: "amount_of_withdrawal_fee",
            type: Number,
            nullable: true,
        },
        assetOfWithdrawalFee: {
            name: "asset_of_withdrawal_fee",
            type: String,
            nullable: true,
        },
        txHash: {
            name: "tx_hash",
            type: String,
            nullable: true,
        },
        externalBlockchainRedeemTxHash: {
            name: "external_blockchain_redeem_tx_hash",
            type: String,
            nullable: true,
        },
        internalRedeemBlockNumber: {
            name: "internal_redeem_block_number",
            type: Number,
            nullable: true,
        },
    },
});

export default WithdrawEntity;
