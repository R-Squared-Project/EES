import { EntitySchemaColumnOptions } from "typeorm/entity-schema/EntitySchemaColumnOptions";
import TimeLock from "context/Domain/ValueObject/TimeLock";

const TimeLockType: EntitySchemaColumnOptions = {
    type: "datetime",
    name: "time_lock",
    transformer: {
        to(timeLock: TimeLock): number {
            return timeLock.value.format("YYYY-MM-DD HH:mm:ss");
        },
        from(value: Date | null): TimeLock | null {
            return value ? TimeLock.fromDate(value) : null;
        },
    },
};

export default TimeLockType;
