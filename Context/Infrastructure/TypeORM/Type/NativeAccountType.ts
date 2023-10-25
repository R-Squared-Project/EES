import { EntitySchemaColumnOptions } from "typeorm/entity-schema/EntitySchemaColumnOptions";
import NativeAccount from "../../../Domain/ValueObject/NativeAccount";

const NativeAccountType: EntitySchemaColumnOptions = {
    type: String,
    name: "native_account",
    transformer: {
        to(nativeAccount: NativeAccount): string {
            return nativeAccount.value;
        },
        from(value: string | null): NativeAccount | null {
            return value ? NativeAccount.create(value) : null;
        },
    },
};

export default NativeAccountType;
