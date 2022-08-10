import { EntitySchema } from "typeorm"
import Deposit from "../../../Domain/Deposit";
import UniqueEntityIDType from "../Type/UniqueEntityIDType";
import SessionIdType from "../Type/SessionIdType";

const DepositEntity = new EntitySchema<Deposit>({
    name: "Deposit",
    target: Deposit,
    columns: {
        // @ts-ignore
        id: UniqueEntityIDType,
        // @ts-ignore
        _sessionId: SessionIdType,
        // @ts-ignore
        _revpopAccount: {
            type: String,
            name: 'revpop_account',
            nullable: true
        },
        // @ts-ignore
        _txHash: {
            type: String,
            name: 'tx_hash',
            nullable: true
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

export default DepositEntity