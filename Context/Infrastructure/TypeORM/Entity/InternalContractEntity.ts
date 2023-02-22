import {EntitySchema} from "typeorm"
import InternalContract from "context/Domain/InternalContract";

const InternalContractEntity = new EntitySchema<InternalContract>({
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
        _createdAt: {
            name: 'created_at',
            createDate: true,
        },
    },
})

export default InternalContractEntity
