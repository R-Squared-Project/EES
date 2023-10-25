import ValueObject from "../../Core/Domain/ValueObject";
import {NativeAccountValidationError} from "context/Domain/Errors";

interface NativeAccountProps {
    value: string;
}

export default class NativeAccount extends ValueObject<NativeAccountProps> {
    private constructor(props: NativeAccountProps) {
        super(props);
    }

    public static create(nativeAccount: string): NativeAccount {
        if (nativeAccount.length === 0) {
            throw new NativeAccountValidationError('Native account can not be empty', nativeAccount)
        }

        return new NativeAccount({value: nativeAccount})
    }
}
