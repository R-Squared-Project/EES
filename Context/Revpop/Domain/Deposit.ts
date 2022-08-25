import AggregateRoot from "../../Core/Domain/AggregateRoot";
import UniqueEntityID from "../../Core/Domain/UniqueEntityID";
import TxHash from "./TxHash";
import RevpopAccount from "./RevpopAccount";
import DepositConfirmedEvent from "./Event/DepositConfirmedEvent";
import {left, Result, right} from "../../Core";
import {DepositAlreadyRedeemed, DepositNotConfirmed, DepositNotCreatedInRevpop, RedeemUnexpectedError} from "./Errors";
import DepositRedeemedEvent from "./Event/DepositRedeemedEvent";

enum STATUS {
    CREATED_BY_USER = 1,
    CREATED_BY_BLOCKCHAIN = 2,
    CONFIRMED = 6,
    CREATED_IN_REVPOP = 10,
    REDEEMED = 15
}

export default class Deposit extends AggregateRoot {
    private _revpopContractId: string | null = null;

    constructor(
        private _txHash: TxHash,
        private _status: number,
        private _value: string | null,
        private _hashLock: string | null,
        private _revpopAccount: RevpopAccount | null,
        id?: UniqueEntityID
    ) {
        super(id)
    }

    confirmByUser(revpopAccount: RevpopAccount) {
        this._revpopAccount = revpopAccount

        if (this._status === STATUS.CREATED_BY_BLOCKCHAIN) {
            this._status = STATUS.CONFIRMED

            this.addDomainEvent(new DepositConfirmedEvent(
                this._txHash.value,
                this._revpopAccount.value
            ))
        }
    }

    confirmByBlockchain() {
        if (this._status === STATUS.CREATED_BY_USER) {
            this._status = STATUS.CONFIRMED

            this.addDomainEvent(new DepositConfirmedEvent(
                this._txHash.value,
                (this._revpopAccount as RevpopAccount).value
            ))
        }
    }

    createdInRevpopBlockchain(revpopContractId: string) {
        this._status = STATUS.CREATED_IN_REVPOP
        this._revpopContractId = revpopContractId
    }

    redeem() {
        if (this._status === STATUS.CREATED_BY_USER || this._status === STATUS.CREATED_BY_BLOCKCHAIN) {
            return left(new DepositNotConfirmed(this._txHash.value));
        }

        if (this._status === STATUS.CONFIRMED) {
            return left(new DepositNotCreatedInRevpop(this._txHash.value));
        }

        if (this._status === STATUS.REDEEMED) {
            return left(new DepositAlreadyRedeemed(this._revpopContractId ?? this._txHash.value));
        }

        if (this._status === STATUS.CREATED_IN_REVPOP) {
            this._status = STATUS.REDEEMED

            this.addDomainEvent(new DepositRedeemedEvent(this._txHash.value))

            return right(Result.ok<void>())
        }

        return left(new RedeemUnexpectedError(this._revpopContractId ?? this._txHash.value));
    }

    get txHash(): TxHash {
        return this._txHash
    }

    get revpopAccount(): RevpopAccount | null {
        return this._revpopAccount;
    }

    get revpopContractId(): string | null {
        return this._revpopContractId;
    }

    static createByUser(
        txHash: TxHash,
        revpopAccount: RevpopAccount,
        hashLock: string,
    ): Deposit {
        return new Deposit(txHash, STATUS.CREATED_BY_USER, null, hashLock, revpopAccount)
    }

    static createByBlockchain(
        txHash: TxHash,
        value: string,
        hashLock: string
    ): Deposit {
        return new Deposit(txHash, STATUS.CREATED_BY_BLOCKCHAIN, value, hashLock, null)
    }
}