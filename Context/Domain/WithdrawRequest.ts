import AggregateRoot from "../Core/Domain/AggregateRoot";
import RevpopAccount from "./ValueObject/RevpopAccount";
import { WithdrawRequestValidationError } from "context/Domain/Errors";

export const STATUS_CREATED = 1;
export const STATUS_WITHDRAW_CREATED = 5;

export default class WithdrawRequest extends AggregateRoot {
    private _status: number;
    private constructor(
        private _revpopAccount: RevpopAccount,
        private _amountToPayInRVETH: number,
        private _addressOfUserInEthereum: string,
        private _withdrawalFeeAmount: number,
        private _withdrawalFeeCurrency: string
    ) {
        super();
        this._status = STATUS_CREATED;
    }

    get revpopAccount(): RevpopAccount {
        return this._revpopAccount;
    }

    get amountToPayInRVETH(): number {
        return this._amountToPayInRVETH;
    }

    get addressOfUserInEthereum(): string {
        return this._addressOfUserInEthereum;
    }

    get status(): number {
        return this._status;
    }

    get withdrawalFeeAmount(): number {
        return this._withdrawalFeeAmount;
    }

    get withdrawalFeeCurrency(): string {
        return this._withdrawalFeeCurrency;
    }

    static create(
        revpopAccount: RevpopAccount,
        amountToPayInRVETH: number,
        addressOfUserInEthereum: string,
        withdrawalFeeAmount: number,
        withdrawalFeeCurrency: string
    ): WithdrawRequest {
        if (amountToPayInRVETH <= 0) {
            throw new WithdrawRequestValidationError("Amount to pay in RVETH can not be negative or zero");
        }
        if (addressOfUserInEthereum.length === 0) {
            throw new WithdrawRequestValidationError("Address of user in Ethereum can not be empty");
        }
        if (withdrawalFeeAmount <= 0) {
            throw new WithdrawRequestValidationError("Withdrawal fee amount can not be negative or zero");
        }
        if (withdrawalFeeCurrency.length === 0) {
            throw new WithdrawRequestValidationError("Withdrawal fee currency can not be empty");
        }
        return new WithdrawRequest(
            revpopAccount,
            amountToPayInRVETH,
            addressOfUserInEthereum,
            withdrawalFeeAmount,
            withdrawalFeeCurrency
        );
    }

    withdrawCreated(): void {
        this._status = STATUS_WITHDRAW_CREATED;
    }
}
