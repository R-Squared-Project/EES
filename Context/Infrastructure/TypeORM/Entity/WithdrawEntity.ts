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
    },
});

export default WithdrawEntity;
