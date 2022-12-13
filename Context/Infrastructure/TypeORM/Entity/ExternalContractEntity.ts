import {EntitySchema} from "typeorm"
import ExternalContract from "context/Domain/ExternalContract";

const ExternalContractEntity = new EntitySchema<ExternalContract>({
    name: "ExternalContract",
    tableName: 'external_contract',
    target: ExternalContract,
    columns: {
        idString: {
            name: 'id',
            type: String,
            primary: true
        },
        // @ts-ignore
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
