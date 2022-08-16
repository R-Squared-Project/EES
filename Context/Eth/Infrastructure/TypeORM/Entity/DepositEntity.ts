import {EntitySchema} from "typeorm"
import Deposit from "../../../Domain/Deposit";
import UniqueEntityIDType from "../Type/UniqueEntityIDType";
import TxHashType from "../Type/TxHashType";
import AddressType from "../Type/AddressType";

const DepositEntity = new EntitySchema<Deposit>({
    name: "Deposit",
    target: Deposit,
    columns: {
        id: UniqueEntityIDType,
        // @ts-ignore
        _txHash: TxHashType,
        _contractId: {
            type: String,
            name: 'contract_id'
        },
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
        _hashLock: {
            type: String,
            name: 'hash_lock',
        },
        _timeLock: {
            type: Date,
            name: 'time_lock',
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

export default DepositEntity