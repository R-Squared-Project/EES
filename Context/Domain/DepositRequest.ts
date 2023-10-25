import AggregateRoot from "../Core/Domain/AggregateRoot";
import NativeAccount from "./ValueObject/NativeAccount";
import HashLock from "./ValueObject/HashLock";

export default class DepositRequest extends AggregateRoot {
    private _status: number;

    constructor(private _nativeAccount: NativeAccount, private _hashLock: HashLock) {
        super();
        this._status = 1;
    }

    get nativeAccount(): NativeAccount {
        return this._nativeAccount;
    }

    get hashLock(): HashLock {
        return this._hashLock;
    }

    get status(): number {
        return this._status;
    }

    static create(nativeAccount: NativeAccount, hashLock: HashLock): DepositRequest {
        const depositRequest = new DepositRequest(nativeAccount, hashLock);

        return depositRequest;
    }
}
