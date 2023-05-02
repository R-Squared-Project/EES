import AggregateRoot from "../Core/Domain/AggregateRoot";
import RevpopAccount from "./ValueObject/RevpopAccount";
import HashLock from "./ValueObject/HashLock";

export default class WithdrawRequest extends AggregateRoot {
    private _status: number;
    private _hashLock: HashLock | undefined;
    constructor(
        private _revpopAccount: RevpopAccount,
        private _amountToPayInRVETH: number,
        private _addressOfUserInEthereum: string
    ) {
        super();
        this._status = 1;
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

    get hashLock(): HashLock | undefined {
        return this._hashLock;
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
}
