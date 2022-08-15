import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import RevpopAccount from "../../../Domain/RevpopAccount";

const RevpopAccountType: EntitySchemaColumnOptions = {
    type: String,
    name: 'revpop_account',
    nullable: true,
    transformer: {
        to(revpopAccount: RevpopAccount | null): string | null {
            if (revpopAccount === null) {
                return null
            }

            return revpopAccount.value
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