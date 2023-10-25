export default class SubmitDepositRequest {
    constructor(private _nativeAccount: string, private _hashLock: string) {}

    get nativeAccount(): string {
        return this._nativeAccount;
    }

    get hashLock(): string {
        return this._hashLock;
    }
}
