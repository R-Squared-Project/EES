export default class CreateContractInRevpop {
    constructor(
        private _txHash: string
    ) {}

    get txHash(): string {
        return this._txHash;
    }
}