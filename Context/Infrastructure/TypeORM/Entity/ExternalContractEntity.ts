import {EntitySchema} from "typeorm"
import ExternalContract from "context/Domain/ExternalContract";
import AddressType from "context/Infrastructure/TypeORM/Type/AddressType";
import HashLockType from "context/Infrastructure/TypeORM/Type/HashLockType";
import TimeLockType from "context/Infrastructure/TypeORM/Type/TimeLockType";

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
        _sender: {
            ...AddressType,
            name: 'sender'
        },
        _receiver: {
            ...AddressType,
            name: 'receiver'
        },
        _value: {
            type: String,
            name: 'value',
        },
        _hashLock: HashLockType,
        _timeLock: TimeLockType,
        _txHash: {
            type: String,
            name: 'tx_hash',
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

export default ExternalContractEntity
