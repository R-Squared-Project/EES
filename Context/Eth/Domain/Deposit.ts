import dayjs from 'dayjs';
import {Either, left, Result, right} from '../../Core';
import AggregateRoot from '../../Core/Domain/AggregateRoot';
import UniqueEntityID from '../../Core/Domain/UniqueEntityID';
import TxHash from './TxHash';
import Address from './Address';
import RedeemTxHash from './RedeemTxHash';
import DepositCreatedEvent from './Event/DepositCreatedEvent';
import {RedeemUnexpectedError} from './Errors';

enum STATUS {
    CREATED = 1,
    REDEEMED = 5
}

export default class Deposit extends AggregateRoot {
    private _status: number
    private _redeemTxHash: RedeemTxHash | null = null

    constructor(
        private _txHash: TxHash,
        private _contractId: string,
        private _sender: Address,
        private _receiver: Address,
        private _value: string,
        private _hashLock: string,
        private _timeLock: Date,
        id?: UniqueEntityID
    ) {
        super(id)
        this._status = STATUS.CREATED
    }

    redeem(txHash: RedeemTxHash): Either<RedeemUnexpectedError, Result<void>> {
        if (this._status === STATUS.CREATED) {
            this._status = STATUS.REDEEMED
            this._redeemTxHash = txHash

            return right(Result.ok<void>())
        }

        return left(new RedeemUnexpectedError(this.contractId, `Wrong status`));
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

    get timelock(): Date {
        return this._timeLock;
    }

    get status(): number {
        return this._status;
    }

    static create(
        _txHash: TxHash,
        _contractId: string,
        _sender: Address,
        _receiver: Address,
        _value: string,
        _hashLock: string,
        _timelock: Date,
    ): Deposit {
        const deposit = new Deposit(
            _txHash,
            _contractId,
            _sender,
            _receiver,
            _value,
            _hashLock,
            _timelock
        )

        deposit.addDomainEvent(new DepositCreatedEvent(
            deposit.txHash.value,
            deposit.contractId,
            deposit.sender.value,
            deposit.receiver.value,
            deposit.value,
            deposit.hashLock,
            dayjs(deposit.timelock).unix()
        ))

        return deposit
    }
}