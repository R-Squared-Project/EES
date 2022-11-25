import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface AddressProps {
    value: string;
}

export default class Address extends ValueObject<AddressProps> {
    private constructor(props: AddressProps) {
        super(props);
    }

    public static create(address: string): Result<Address> {
        if (address.length === 0) {
            return Result.fail<Address>('Must provide an address')
        }

        if (!/^0x([A-Fa-f0-9]{40})$/.test(address)) {
            return Result.fail<Address>('Address is invalid')
        }

        return Result.ok<Address>(new Address({value: address}))
    }
}