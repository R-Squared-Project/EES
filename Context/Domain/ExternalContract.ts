import UniqueEntityID from "context/Core/Domain/UniqueEntityID";
import Entity from "context/Core/Domain/Entity";
import {HashZero} from "@ethersproject/constants";
import HashLock from "context/Domain/ValueObject/HashLock";
import Address from "context/Domain/ValueObject/Address";
import TimeLock from "context/Domain/ValueObject/TimeLock";

export default class ExternalContract extends Entity {
    private _withdrawn: boolean
    private _refunded: boolean
    private _preimage: string
    private _status: number

    constructor(
        contractId: UniqueEntityID,
        private _sender: Address,
        private _receiver: Address,
        private _value: string,
        private _hashLock: HashLock,
        private _timeLock: TimeLock,
        private _txHash: string
    ) {
        super(contractId);
        this._withdrawn = false
        this._refunded = false
        this._preimage = HashZero
        this._status = 1

        // TODO::TypeORM tries validate empty contract when read metadata
        // new ExternalContractValidator(this).validate()
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

    get hashLock(): HashLock {
        return this._hashLock;
    }

    get timeLock(): TimeLock {
        return this._timeLock;
    }

    get txHash(): string {
        return this._txHash
    }
}
