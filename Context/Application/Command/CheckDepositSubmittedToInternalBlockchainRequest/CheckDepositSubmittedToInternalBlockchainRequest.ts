export default class CheckDepositSubmittedToInternalBlockchainRequest {
    constructor(
        private _sessionId: string
    ) {}

    get sessionId(): string {
        return this._sessionId;
    }
}
