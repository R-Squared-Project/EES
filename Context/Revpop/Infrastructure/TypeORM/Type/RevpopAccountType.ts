import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import RevpopAccount from "../../../Domain/RevpopAccount";

const RevpopAccountType: EntitySchemaColumnOptions = {
    type: String,
    name: 'revpop_account',
    transformer: {
        to(revpopAccount: RevpopAccount): string {
            return revpopAccount.value
        },
        from(value: string): RevpopAccount {
            return RevpopAccount.create(value).getValue() as RevpopAccount
        }
    }
}

export default RevpopAccountType