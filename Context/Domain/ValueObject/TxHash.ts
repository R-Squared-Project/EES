import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface Props {
    value: string;
}

export default class TxHash extends ValueObject<Props> {
    private constructor(props: Props) {
        super(props);
    }

    public static create(txHash: string): Result<TxHash> {
        if (txHash.length === 0) {
            return Result.fail<TxHash>('Must provide a transaction hash')
        }

        if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
            return Result.fail<TxHash>('txHash is invalid')
        }

        return Result.ok<TxHash>(new TxHash({value: txHash}))
    }
}
