import {EntitySchemaColumnOptions} from "typeorm/entity-schema/EntitySchemaColumnOptions";
import RedeemTxHash from "../../../Domain/RedeemTxHash";

const RedeemTxHashType: EntitySchemaColumnOptions = {
    type: String,
    name: 'redeem_tx_hash',
    nullable: true,
    transformer: {
        to(redeemTxHash: RedeemTxHash | null): string | null {
            if (null === redeemTxHash) {
                return null
            }

            return redeemTxHash.value
        },
        from(value: string | null): RedeemTxHash | null {
            if (null === value) {
                return value
            }

            return RedeemTxHash.create(value).getValue() as RedeemTxHash
        }
    }
}

export default RedeemTxHashType