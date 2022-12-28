import {EntitySchema} from "typeorm"
import ExternalContract from "context/Domain/ExternalContract";
import InternalContract from "context/Domain/InternalContract";

const InternalContractEntity = new EntitySchema<ExternalContract>({
    name: "InternalContract",
    tableName: 'internal_contract',
    target: InternalContract,
    columns: {
        //@ts-ignore
        id: {
            name: 'id',
            type: Number,
            primary: true,
            generated: true,
        },
        _internalId: {
            type: String,
            name: 'internalId',
        },
        _externalId: {
            type: String,
            name: 'externalId',
        },
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

export default InternalContractEntity
