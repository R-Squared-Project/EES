export default class GetLastWithdrawContracts {
    get lastOperation(): string {
        return this._lastOperation;
    }
    constructor(private _lastOperation: string) {}
}
