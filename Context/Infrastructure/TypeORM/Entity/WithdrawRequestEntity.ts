import {EntitySchema} from "typeorm"
import WithdrawRequest from "context/Domain/WithdrawRequest";
import RevpopAccountType from "../Type/RevpopAccountType";
import HashLockType from "../Type/HashLockType";

const WithdrawRequestEntity = new EntitySchema<WithdrawRequest>({
    name: "WithdrawRequest",
    tableName: 'withdraw_request',
    target: WithdrawRequest,
    columns: {
        idString: {
            name: 'id',
            type: String,
            primary: true
        },
        // @ts-ignore
        _revpopAccount: RevpopAccountType,
        _hashLock: HashLockType,
        _createdAt: {
            name: 'created_at',
            createDate: true,
        },
    },
})

export default WithdrawRequestEntity
