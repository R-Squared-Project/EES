import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import TxHash from "../../../Domain/TxHash";

const TxHashType: EntitySchemaColumnOptions = {
    type: String,
    name: 'tx_hash',
    nullable: true,
    transformer: {
        to(txHash: TxHash | null): string | null {
            if (txHash === null) {
                return null
            }

            return txHash.value
        },
        from(value: string | null): TxHash | null {
            if (value === null) {
                return null
            }

            return TxHash.create(value).getValue() as TxHash
        }
    }
}

export default TxHashType