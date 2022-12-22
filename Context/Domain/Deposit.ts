import AggregateRoot from "context/Core/Domain/AggregateRoot";
import DepositRequest from "./DepositRequest";
import ExternalContract from "./ExternalContract";
import IncomingContractProcessedEvent from "context/Domain/Event/IncomingContractProcessedEvent";

const STATUS_CREATED = 1
const STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN = 5

export default class Deposit extends AggregateRoot {
    private _status: number

    constructor(
        public _depositRequest: DepositRequest,
        public _externalContract: ExternalContract
    ) {
        super()
        this._status = STATUS_CREATED
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

    public submittedToInternalBlockchain() {
        this._status = STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN
    }

}
