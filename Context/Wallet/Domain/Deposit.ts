export default class Deposit {
    private _status: number
    private _account: string | null = null

    constructor(
        private readonly _sessionId: string
    ) {
        this._status = 1
    }

    get sessionId(): string {
        return this._sessionId;
    }

    confirm(account: string) {
        this._account = account
        this._status = 5
    }
}