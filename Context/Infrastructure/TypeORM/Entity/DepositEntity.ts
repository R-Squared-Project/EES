import { EntitySchema } from "typeorm";
import Deposit from "context/Domain/Deposit";
import UniqueEntityIDType from "context/Infrastructure/TypeORM/Type/UniqueEntityIDType";

const DepositEntity = new EntitySchema<Deposit>({
    name: "Deposit",
    target: Deposit,
    relations: {
        _depositRequest: {
            target: "DepositRequest",
            type: "one-to-one",
            joinColumn: {
                name: "deposit_request_id",
                referencedColumnName: "idString",
            },
        },
        _externalContract: {
            target: "ExternalContract",
            type: "one-to-one",
            joinColumn: {
                name: "external_contract_id",
                referencedColumnName: "idString",
            },
            cascade: ["insert"],
        },
        _internalContract: {
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
        // @ts-ignore
        _secret: {
            type: String,
            name: "secret",
            nullable: true,
        },
        _externalBlockchainRedeemTxHash: {
            type: String,
            name: "external_blockchain_redeem_tx_hash",
            nullable: true,
        },
        _internalBlockchainBurnTxHash: {
            type: String,
            name: "internal_blockchain_burn_tx_hash",
            nullable: true,
        },
        _status: {
            type: Number,
            name: "status",
        },
        _createdAt: {
            name: "created_at",
            createDate: true,
        },
        _mintedAmount: {
            type: String,
            name: "minted_amount",
            nullable: true,
        },
        _burnedAmount: {
            type: String,
            name: "burned_amount",
            nullable: true,
        },
    },
});

export default DepositEntity;
