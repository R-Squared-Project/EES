import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import TxHash from "./TxHash";
import Address from "./Address";

export default class Deposit extends AggregateRoot {
    private _status: number

    constructor(
        private _txHash: TxHash,
        private _contractId: string,
        private _sender: Address,
        private _receiver: Address,
        private _value: string,
        private _hashLock: string,
        private _timelock: number,
        id?: UniqueEntityID
    ) {
        super(id)
        this._status = 1
    }

    get txHash(): TxHash {
        return this._txHash;
    }

    get contractId(): string {
        return this._contractId;
    }

    get sender(): Address {
        return this._sender;
    }

    get receiver(): Address {
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

    get status(): number {
        return this._status;
    }
}