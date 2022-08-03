import {left, Result, right} from "../../Core";
import {DepositAlreadyConfirmed} from "./Errors";

export default class Deposit {
    private _status: number
    private _revpopAccount: string | null = null
    private _txHash: string | null = null

    constructor(
        private _sessionId: string
    ) {
        this._status = 1
    }

    get sessionId(): string {
        return this._sessionId;
    }

    confirm(revpopAccount: string, txHash: string) {
        if (this._status !== 1) {
            return left(new DepositAlreadyConfirmed());
        }

        this._revpopAccount = revpopAccount
        this._txHash = txHash
        this._status = 5

        return right(Result.ok<void>())
    }

    // For TypeOrm
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    set sessionId(value: string) {
        this._sessionId = value;
    }
}