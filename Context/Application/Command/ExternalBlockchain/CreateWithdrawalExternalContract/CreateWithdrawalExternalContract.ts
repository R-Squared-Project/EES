export default class CreateWithdrawalExternalContract {
    constructor(private _withdrawId: string) {}

    get withdrawId(): string {
        return this._withdrawId;
    }
}
