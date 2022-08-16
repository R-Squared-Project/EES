export default class CreateDeposit {
    constructor(
        private _txHash: string,
        private _contractId: string,
        private _sender: string,
        private _receiver: string,
        private _value: string,
        private _hashLock: string,
        private _timelock: number,
    ) {}

    get txHash(): string {
        return this._txHash;
    }

    get contractId(): string {
        return this._contractId;
    }

    get sender(): string {
        return this._sender;
    }

    get receiver(): string {
        return this._receiver;
    }

    get value(): string {
        return this._value;
    }

    get hashLock(): string {
        return this._hashLock;
    }

    get timelock(): number {
        return this._timelock;
    }
}