import dayjs, {Dayjs} from "dayjs";
import ValueObject from "../../Core/Domain/ValueObject";

interface TimeLockProps {
    value: Dayjs;
}

export default class TimeLock extends ValueObject<TimeLockProps> {
    private constructor(props: TimeLockProps) {
        super(props);
    }

    public static fromUnix(timeLock: number): TimeLock {
        return new TimeLock({value: dayjs.unix(timeLock)})
    }

    get unix(): number {
        return this.value.unix()
    }
}
