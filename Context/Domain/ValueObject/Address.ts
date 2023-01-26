import ValueObject from "context/Core/Domain/ValueObject";
import {AddressValidationError} from "context/Domain/Errors";

interface AddressProps {
    value: string;
}

export default class Address extends ValueObject<AddressProps> {
    private constructor(props: AddressProps) {
        super(props);
    }

    public static create(address: string): Address {
        if (address.length === 0) {
            throw new AddressValidationError('Must provide an address', address)
        }

        if (!/^0x([A-Fa-f0-9]{40})$/.test(address)) {
            throw new AddressValidationError('Address is invalid', address)
        }

        return new Address({value: address})
    }
}
