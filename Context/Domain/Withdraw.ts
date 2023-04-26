import AggregateRoot from "context/Core/Domain/AggregateRoot";
import WithdrawRequest from "./WithdrawRequest";
import ExternalContract from "./ExternalContract";
import InternalContract from "context/Domain/InternalContract";
import IncomingContractProcessedEvent from "context/Domain/Event/IncomingContractProcessedEvent";

export const STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN = 5;
export const STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN = 10;
export const STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN = 15;
export const STATUS_COMPLETED = 20;
export const STATUS_BURNED = 105;

export default class Withdraw extends AggregateRoot {
    private _secret: string | null = null;
    private _status: number;
    private _externalContract: ExternalContract | null = null;
    private _transferTxHash: string | null = null;

    constructor(public _withdrawRequest: WithdrawRequest, public _internalContract: InternalContract) {
        super();
        this._status = STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN;
    }

    get internalContract(): InternalContract | null {
        return this._internalContract;
    }

    get externalContract(): ExternalContract | null {
        return this._externalContract;
    }

    get status(): number {
        return this._status;
    }

    get secret(): string | null {
        return this._secret;
    }

    get transferTxHash(): string | null {
        return this._transferTxHash;
    }

    static create(withdrawRequest: WithdrawRequest, internalContract: InternalContract): Withdraw {
        const withdraw = new Withdraw(withdrawRequest, internalContract);

        withdraw.addDomainEvent(new IncomingContractProcessedEvent(withdraw.id.toValue()));

        return withdraw;
    }

    public createdInInternalBlockchain(internalContract: InternalContract) {
        this._internalContract = internalContract;
        this._status = STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN;
    }
}
