import ValueObject from "../../Core/Domain/ValueObject";
import {RevpopAccountValidationError} from "context/Domain/Errors";

interface RevpopAccountProps {
    value: string;
}

export default class RevpopAccount extends ValueObject<RevpopAccountProps> {
    private constructor(props: RevpopAccountProps) {
        super(props);
    }

    public static create(revpopAccount: string): RevpopAccount {
        if (revpopAccount.length === 0) {
            throw new RevpopAccountValidationError('Revpop account can not be empty', revpopAccount)
        }

        return new RevpopAccount({value: revpopAccount})
    }
}
