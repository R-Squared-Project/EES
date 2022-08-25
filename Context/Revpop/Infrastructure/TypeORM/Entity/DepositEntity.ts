import {EntitySchema} from "typeorm"
import Deposit from "../../../Domain/Deposit";
import UniqueEntityIDType from "../Type/UniqueEntityIDType";
import RevpopAccountType from "../Type/RevpopAccountType";
import TxHashType from "../Type/TxHashType";

const DepositEntity = new EntitySchema<Deposit>({
    name: "Deposit",
    target: Deposit,
    columns: {
        id: UniqueEntityIDType,
        // @ts-ignore
        _revpopAccount: RevpopAccountType,
        _txHash: TxHashType,
        _value: {
            type: String,
            name: 'value',
            nullable: true
        },
        _hashLock: {
            type: String,
            name: 'hash_lock'
        },
        _revpopContractId: {
            type: String,
            name: 'revpop_contract_id',
            nullable: true
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