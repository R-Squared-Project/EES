import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import Address from "context/Domain/ValueObject/Address";

const AddressType: EntitySchemaColumnOptions = {
    type: String,
    transformer: {
        to(address: Address): string {
            return address.value
        },
        from(value: string): Address {
            return Address.create(value)
        }
    }
}

export default AddressType
