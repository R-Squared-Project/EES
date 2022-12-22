import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface TxHashProps {
    value: Date;
}

export default class TimeLock extends ValueObject<TxHashProps> {
    private constructor(props: TxHashProps) {
        super(props);
    }

    public static create(timeLock: Date): Result<TimeLock> {
        return Result.ok<TimeLock>(new TimeLock({value: timeLock}))
    }
}
