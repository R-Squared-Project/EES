import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import TxHash from "./TxHash";
import RevpopAccount from "./RevpopAccount";

export default class Deposit extends AggregateRoot {
    private _status: number

    constructor(
        private _txHash: TxHash,
        private _revpopAccount: RevpopAccount,
        id?: UniqueEntityID
    ) {
        super(id)
        this._status = 1
    }

    get txHash(): TxHash {
        return this._txHash
    }

    get revpopAccount(): RevpopAccount {
        return this._revpopAccount;
    }

    static create(
        txHash: TxHash,
        revpopAccount: RevpopAccount,
        id?: UniqueEntityID
    ): Deposit {
        return new Deposit(txHash, revpopAccount, id)
    }
}