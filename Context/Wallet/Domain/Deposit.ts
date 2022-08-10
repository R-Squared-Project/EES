import {left, Result, right} from "../../Core";
import {DepositAlreadyConfirmed} from "./Errors";
import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import DepositInitializedEvent from "./Event/DepositInitializedEvent";
import DepositConfirmedEvent from "./Event/DepositConfirmedEvent";
import SessionId from "./SessionId";

export default class Deposit extends AggregateRoot {
    private _status: number
    private _revpopAccount: string | null = null
    private _txHash: string | null = null

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

    get revpopAccount(): string | null {
        return this._revpopAccount;
    }

    get txHash(): string | null {
        return this._txHash;
    }

    confirm(revpopAccount: string, txHash: string) {
        if (this._status !== 1) {
            return left(new DepositAlreadyConfirmed());
        }

        this._revpopAccount = revpopAccount
        this._txHash = txHash
        this._status = 5

        this.addDomainEvent(new DepositConfirmedEvent(txHash, revpopAccount))

        return right(Result.ok<void>())
    }

    static create(sessionId: SessionId, id?: UniqueEntityID): Deposit {
        const deposit = new Deposit(sessionId, id)

        deposit.addDomainEvent(new DepositInitializedEvent(deposit.sessionId.value))

        return deposit
    }
}