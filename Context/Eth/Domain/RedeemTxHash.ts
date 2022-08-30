import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface TxHashProps {
    value: string;
}

export default class RedeemTxHash extends ValueObject<TxHashProps> {
    private constructor(props: TxHashProps) {
        super(props);
    }

    public static create(txHash: string): Result<RedeemTxHash> {
        if (txHash === null || txHash.length === 0) {
            return Result.fail<RedeemTxHash>('Must provide a transaction hash')
        }

        if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
            return Result.fail<RedeemTxHash>('txHash is invalid')
        }

        return Result.ok<RedeemTxHash>(new RedeemTxHash({value: txHash}))
    }
}