import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import RevpopAccount from "../../../Domain/RevpopAccount";

const RevpopAccountType: EntitySchemaColumnOptions = {
    type: String,
    name: 'revpop_account',
    transformer: {
        to(revpopAccount: RevpopAccount): string | null {
            return revpopAccount?.value || null
        },
        from(value: string | null): RevpopAccount | null {
            if (value === null) {
                return null
            }

            return RevpopAccount.create(value).getValue() as RevpopAccount
        }
    }
}

export default RevpopAccountType