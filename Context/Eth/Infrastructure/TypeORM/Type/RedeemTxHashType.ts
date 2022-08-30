import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import RedeemTxHash from "../../../Domain/RedeemTxHash";

const RedeemTxHashType: EntitySchemaColumnOptions = {
    type: String,
    name: 'redeem_tx_hash',
    nullable: true,
    transformer: {
        to(redeemTxHash: RedeemTxHash): string {
            return redeemTxHash.value
        },
        from(value: string): RedeemTxHash {
            return RedeemTxHash.create(value).getValue() as RedeemTxHash
        }
    }
}

export default RedeemTxHashType