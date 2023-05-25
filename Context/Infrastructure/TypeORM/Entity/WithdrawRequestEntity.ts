import { EntitySchema } from "typeorm";
import WithdrawRequest from "context/Domain/WithdrawRequest";
import RevpopAccountType from "../Type/RevpopAccountType";

const WithdrawRequestEntity = new EntitySchema<WithdrawRequest>({
    name: "WithdrawRequest",
    tableName: "withdraw_request",
    target: WithdrawRequest,
    columns: {
        idString: {
            name: "id",
            type: String,
            primary: true,
        },
        // @ts-ignore
        _status: {
            name: "status",
            type: Number,
        },
        _revpopAccount: RevpopAccountType,
        _createdAt: {
            name: "created_at",
            createDate: true,
        },
        _amountToPayInRVETH: {
            name: "amount_to_pay_in_RVETH",
            type: "decimal",
            precision: 15,
            scale: 5,
        },
        _addressOfUserInEthereum: {
            name: "address_of_user_in_ethereum",
            type: String,
        },
        _withdrawalFeeAmount: {
            name: "withdrawal_fee_amount",
            type: "decimal",
            precision: 15,
            scale: 5,
        },
        _withdrawalFeeCurrency: {
            name: "withdrawal_fee_currency",
            type: String,
        },
    },
});

export default WithdrawRequestEntity;
