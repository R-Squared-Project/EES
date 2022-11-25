import {EntitySchema} from "typeorm"
import UniqueEntityIDType from "context/Infrastructure/TypeORM/Type/UniqueEntityIDType";
import ExternalContract from "context/Domain/ExternalContract";

const ExternalContractEntity = new EntitySchema<ExternalContract>({
    name: "ExternalContract",
    tableName: 'external_contract',
    target: ExternalContract,
    columns: {
        // @ts-ignore
        id: UniqueEntityIDType,
        _status: {
            type: Number,
            name: 'status',
        },
        _createdAt: {
            name: 'created_at',
            createDate: true,
        },
    },
})

export default ExternalContractEntity
