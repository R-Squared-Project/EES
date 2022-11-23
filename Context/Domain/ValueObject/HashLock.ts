import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface TxHashProps {
    value: string;
}

export default class HashLock extends ValueObject<TxHashProps> {
    private constructor(props: TxHashProps) {
        super(props);
    }

    public static create(hashLock: string): Result<HashLock> {
        if (!hashLock || hashLock.length === 0) {
            return Result.fail<HashLock>('Must provide a hashlock')
        }

        if (!/^0x([A-Fa-f0-9]{64})$/.test(hashLock)) {
            return Result.fail<HashLock>('HashLock format is invalid')
        }

        return Result.ok<HashLock>(new HashLock({value: hashLock}))
    }
}
