import AggregateRoot from "../Core/Domain/AggregateRoot";
import RevpopAccount from "./ValueObject/RevpopAccount";

export const STATUS_CREATED = 1;
export const STATUS_WITHDRAW_CREATED = 5;

export default class WithdrawRequest extends AggregateRoot {
    private _status: number;
    constructor(
        private _revpopAccount: RevpopAccount,
        private _amountToPayInRVETH: number,
        private _addressOfUserInEthereum: string
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

    static create(
        revpopAccount: RevpopAccount,
        amountToPayInRVETH: number,
        addressOfUserInEthereum: string
    ): WithdrawRequest {
        return new WithdrawRequest(revpopAccount, amountToPayInRVETH, addressOfUserInEthereum);
    }

    withdrawCreated(): void {
        this._status = STATUS_WITHDRAW_CREATED;
    }
}
