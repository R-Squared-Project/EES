import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import TxHash from "../../../Domain/TxHash";

const TxHashType: EntitySchemaColumnOptions = {
    type: String,
    name: 'tx_hash',
    nullable: false,
    transformer: {
        to(txHash: TxHash): string {
            return txHash.value
        },
        from(value: string): TxHash {
            return TxHash.create(value).getValue() as TxHash
        }
    }
}

export default TxHashType