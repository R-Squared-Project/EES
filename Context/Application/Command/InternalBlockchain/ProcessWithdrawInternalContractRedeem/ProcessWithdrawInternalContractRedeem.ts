export default class ProcessWithdrawInternalContractRedeem {
    constructor(private _withdrawId: string) {}

    get withdrawId(): string {
        return this._withdrawId;
    }
}
