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
        _status: {
            type: Number,
            name: 'status'
        },
    },
})

export default DepositEntity