import {EntitySchema} from "typeorm"
import Deposit from "../../../Domain/Deposit";
import RevpopAccountType from "../Type/RevpopAccountType";
import HashLockType from "../Type/HashLockType";
import UniqueEntityIDType from "../Type/UniqueEntityIDType";

const DepositEntity = new EntitySchema<Deposit>({
    name: "Deposit",
    target: Deposit,
    columns: {
        id: UniqueEntityIDType,
        // @ts-ignore
        _revpopAccount: RevpopAccountType,
        _hashLock: HashLockType,
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