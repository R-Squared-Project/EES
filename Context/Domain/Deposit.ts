import AggregateRoot from "context/Core/Domain/AggregateRoot";
import DepositRequest from "./DepositRequest";
import ExternalContract from "./ExternalContract";
import IncomingContractProcessedEvent from "context/Domain/Event/IncomingContractProcessedEvent";

export default class Deposit extends AggregateRoot {
    private _status: number

    constructor(
        public _depositRequest: DepositRequest,
        public _externalContract: ExternalContract
    ) {
        super()
        this._status = 1
    }

    get status(): number {
        return this._status;
    }

    static create(depositRequest: DepositRequest, externalContract: ExternalContract): Deposit {
        const deposit = new Deposit(depositRequest, externalContract)

        deposit.addDomainEvent(new IncomingContractProcessedEvent(
            deposit.id.toValue()
        ))

        return deposit
    }
}
