import { EntitySchemaColumnOptions } from "typeorm/entity-schema/EntitySchemaColumnOptions";
import RevpopAccount from "../../../Domain/ValueObject/RevpopAccount";

const RevpopAccountType: EntitySchemaColumnOptions = {
    type: String,
    name: "revpop_account",
    transformer: {
        to(revpopAccount: RevpopAccount): string {
            return revpopAccount.value;
        },
        from(value: string | null): RevpopAccount | null {
            return value ? RevpopAccount.create(value) : null;
        },
    },
};

export default RevpopAccountType;
