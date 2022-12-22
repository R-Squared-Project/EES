import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import UniqueEntityID from "../../../Core/Domain/UniqueEntityID";

const UniqueEntityIDType: EntitySchemaColumnOptions = {
    type: String,
    primary: true,
    transformer: {
        to(value: UniqueEntityID): string {
            return value.toValue()
        },
        from(value: string): UniqueEntityID {
            return new UniqueEntityID(value)
        }
    }
}

export default UniqueEntityIDType
