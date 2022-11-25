import ValueObject from "../../Core/Domain/ValueObject";
import {HashLockValidationError} from "context/Domain/Errors";

interface TxHashProps {
    value: string;
}

export default class HashLock extends ValueObject<TxHashProps> {
    private constructor(props: TxHashProps) {
        super(props);
    }

    public static create(hashLock: string): HashLock {
        if (!hashLock || hashLock.length === 0) {
            throw new HashLockValidationError('HashLock can not be empty', hashLock)
        }

        if (!/^0x([A-Fa-f0-9]{64})$/.test(hashLock)) {
            throw new HashLockValidationError('HashLock format is invalid', hashLock)
        }

        return new HashLock({value: hashLock})
    }
}
