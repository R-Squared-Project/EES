import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface TxHashProps {
    value: string;
}

export default class TxHash extends ValueObject<TxHashProps> {
    private constructor(props: TxHashProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
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