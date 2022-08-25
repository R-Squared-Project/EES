export default class ConfirmDepositByBlockchain {
    constructor(
        private _txHash: string,
        private _value: string,
        private _hashLock: string
    ) {}

    get txHash(): string {
        return this._txHash;
    }

    get value(): string {
        return this._value;
    }

    get hashLock(): string {
        return this._hashLock;
    }
}