import {Either, Result, right} from "../Core";
import AggregateRoot from "../Core/Domain/AggregateRoot";
import RevpopAccount from "./ValueObject/RevpopAccount";
import HashLock from "./ValueObject/HashLock";
import {CreateDepositUnexpectedError} from "./Errors";

export default class Deposit extends AggregateRoot {
    private _status: number

    constructor(
        private _revpopAccount: RevpopAccount,
        private _hashLock: HashLock
    ) {
        super()
        this._status = 1
    }

    get status(): number {
        return this._status;
    }

    static create(revpopAccount: RevpopAccount, hashLock: HashLock): Either<CreateDepositUnexpectedError, Result<Deposit>> {
        const deposit = new Deposit(revpopAccount, hashLock)

        return right(Result.ok(deposit))
    }
}
