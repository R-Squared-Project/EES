import {left, Result, right} from "../../Core";
import {DepositAlreadyConfirmed} from "./Errors";
import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import DepositInitializedEvent from "./Event/DepositInitializedEvent";
import DepositConfirmedEvent from "./Event/DepositConfirmedEvent";
import SessionId from "./SessionId";
import RevpopAccount from "./RevpopAccount";
import TxHash from "./TxHash";

export default class Deposit extends AggregateRoot {
    private _status: number
    private _revpopAccount: RevpopAccount | null = null
    private _txHash: TxHash | null = null

    constructor(
        private _sessionId: SessionId,
        id?: UniqueEntityID
    ) {
        super(id)
        this._status = 1
    }

    get sessionId(): SessionId {
        return this._sessionId
    }

    get status(): number {
        return this._status;
    }

    get revpopAccount(): RevpopAccount | null {
        return this._revpopAccount;
    }

    get txHash(): TxHash | null {
        return this._txHash;
    }

    confirm(txHash: TxHash, revpopAccount: RevpopAccount, ) {
        if (this._status !== 1) {
            return left(new DepositAlreadyConfirmed());
        }

        this._revpopAccount = revpopAccount
        this._txHash = txHash
        this._status = 5

        this.addDomainEvent(new DepositConfirmedEvent(txHash.value, revpopAccount.value))

        return right(Result.ok<void>())
    }

    static create(sessionId: SessionId, id?: UniqueEntityID): Deposit {
        const deposit = new Deposit(sessionId, id)

        deposit.addDomainEvent(new DepositInitializedEvent(deposit.sessionId.value))

        return deposit
    }
}