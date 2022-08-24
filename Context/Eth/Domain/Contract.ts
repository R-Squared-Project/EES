import {Dayjs} from "dayjs";

export default class Contract {
    constructor(
        private _contractId: string,
        private _sender: string,
        private _receiver: string,
        private _value: string,
        private _hashLock: string,
        private _timeLock: number,
        private _withdrawn: boolean,
        private _refunded: boolean,
        private _preimage: string,
        private _createdAt: Dayjs
    ) {}

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

    get timeLock(): number {
        return this._timeLock;
    }

    get withdrawn(): boolean {
        return this._withdrawn;
    }

    get refunded(): boolean {
        return this._refunded;
    }

    get preimage(): string {
        return this._preimage;
    }

    get createdAt(): Dayjs {
        return this._createdAt;
    }
}