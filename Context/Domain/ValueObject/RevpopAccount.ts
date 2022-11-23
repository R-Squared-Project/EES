import ValueObject from "../../Core/Domain/ValueObject";
import {Result} from "../../Core";

interface RevpopAccountProps {
    value: string;
}

export default class RevpopAccount extends ValueObject<RevpopAccountProps> {
    private constructor(props: RevpopAccountProps) {
        super(props);
    }

    public static create(revpopAccount: string): Result<RevpopAccount> {
        if (revpopAccount.length === 0) {
            return Result.fail<RevpopAccount>('Must provide a revpop account')
        }

        return Result.ok<RevpopAccount>(new RevpopAccount({value: revpopAccount}))
    }
}
