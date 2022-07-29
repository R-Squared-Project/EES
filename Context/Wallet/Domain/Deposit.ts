export default class Deposit {
    private _id: string
    private _status: number
    private _account: string

    constructor(
        readonly private _secret: string
    ) {
        this._status = 1
    }

    get secret(): string {
        return this._secret;
    }

    confirm(account: string) {
        this._account = account
        this._status = 5
    }
}