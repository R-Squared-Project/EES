import { EntitySchemaColumnOptions } from "typeorm/entity-schema/EntitySchemaColumnOptions";
import Address from "context/Domain/ValueObject/Address";

const AddressType: EntitySchemaColumnOptions = {
    type: String,
    transformer: {
        to(address: Address): string {
            return address.value;
        },
        from(value: string | null): Address | null {
            return value ? Address.create(value) : null;
        },
    },
};

export default AddressType;
