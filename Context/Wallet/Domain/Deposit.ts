import {left, Result, right} from "../../Core";
import {DepositAlreadyConfirmed} from "./Errors";
import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import DepositId from "./DepositId";
import DepositInitializedEvent from "./Event/DepositInitializedEvent";
import DepositConfirmedEvent from "./Event/DepositConfirmedEvent";

export default class Deposit extends AggregateRoot {
    private _status: number
    private _revpopAccount: string | null = null
    private _txHash: string | null = null

    constructor(
        id: UniqueEntityID
    ) {
        super(id)
        this._status = 1
    }

    get sessionId(): DepositId {
        return DepositId.create(this._id);
    }

    confirm(revpopAccount: string, txHash: string) {
        if (this._status !== 1) {
            return left(new DepositAlreadyConfirmed());
        }

        this._revpopAccount = revpopAccount
        this._txHash = txHash
        this._status = 5

        this.addDomainEvent(new DepositConfirmedEvent(this.sessionId, txHash, revpopAccount))

        return right(Result.ok<void>())
    }

    static create(sessionId: string): Deposit {
        const id = new UniqueEntityID(sessionId)
        const deposit = new Deposit(id)

        deposit.addDomainEvent(new DepositInitializedEvent(deposit.sessionId))

        return deposit

    }
}