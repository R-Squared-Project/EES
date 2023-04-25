import { EntitySchemaColumnOptions } from "typeorm/entity-schema/EntitySchemaColumnOptions";
import HashLock from "../../../Domain/ValueObject/HashLock";

const HashLockType: EntitySchemaColumnOptions = {
    type: String,
    nullable: true,
    name: "hash_lock",
    transformer: {
        to(hashLock: HashLock | undefined): string {
            return hashLock?.value;
        },
        from(value: string): HashLock {
            return HashLock.create(value);
        },
    },
};

export default HashLockType;
