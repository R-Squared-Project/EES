export default class CreateContractInInternalBlockchain {
    constructor(
        private _depositId: string
    ) {}

    get depositId(): string {
        return this._depositId;
    }
}
