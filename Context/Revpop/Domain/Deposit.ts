import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import TxHash from "./TxHash";
import RevpopAccount from "./RevpopAccount";
import DepositConfirmedEvent from "./Event/DepositConfirmedEvent";

enum STATUS {
    CREATED_BY_USER = 1,
    CREATED_BY_BLOCKCHAIN = 2,
    CONFIRMED = 5
}

export default class Deposit extends AggregateRoot {
    constructor(
        private _txHash: TxHash,
        private _status: number,
        private _revpopAccount: RevpopAccount | null,
        id?: UniqueEntityID
    ) {
        super(id)
        this._status = STATUS.CREATED_BY_USER
    }

    confirmByUser(revpopAccount: RevpopAccount) {
        this._revpopAccount = revpopAccount
        this._status = STATUS.CONFIRMED

        this.addDomainEvent(new DepositConfirmedEvent(
            this._txHash.value,
            this._revpopAccount.value
        ))
    }

    confirmByBlockchain() {
        this._status = STATUS.CONFIRMED

        if (this._revpopAccount !== null) {
            this.addDomainEvent(new DepositConfirmedEvent(
                this._txHash.value,
                this._revpopAccount.value
            ))
        }
    }

    get txHash(): TxHash {
        return this._txHash
    }

    get revpopAccount(): RevpopAccount | null {
        return this._revpopAccount;
    }

    static createByUser(
        txHash: TxHash,
        revpopAccount: RevpopAccount
    ): Deposit {
        return new Deposit(txHash, STATUS.CREATED_BY_USER, revpopAccount)
    }

    static createByBlockchain(
        txHash: TxHash
    ): Deposit {
        return new Deposit(txHash, STATUS.CREATED_BY_BLOCKCHAIN, null)
    }
}