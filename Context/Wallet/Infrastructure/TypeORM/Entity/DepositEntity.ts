import { EntitySchema } from "typeorm"
import Deposit from "../../../Domain/Deposit";

const DepositEntity = new EntitySchema<Deposit>({
    name: "Deposit",
    target: Deposit,
    columns: {
        // @ts-ignore
        sessionId: {
            type: String,
            primary: true
        },
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