import AggregateRoot from "context/Core/Domain/AggregateRoot";
import DepositRequest from "./DepositRequest";
import ExternalContract from "./ExternalContract";
import InternalContract from "context/Domain/InternalContract";
import IncomingContractProcessedEvent from "context/Domain/Event/IncomingContractProcessedEvent";
import CreateContractInInternalBlockchainValidator from "./Validation/CreateContractInInternalBlockchainValidator";

export const STATUS_CREATED = 1
export const STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN = 5
const STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN = 10

export default class Deposit extends AggregateRoot {
    private _status: number
    public _internalContract: InternalContract | null = null

    constructor(
        public _depositRequest: DepositRequest,
        public _externalContract: ExternalContract
    ) {
        super()
        this._status = STATUS_CREATED
    }

    get internalContract(): InternalContract | null {
        return this._internalContract;
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
        new CreateContractInInternalBlockchainValidator(this).validate()

        this._status = STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN
    }

    public createdInInternalBlockchain(internalContract: InternalContract) {
        this._internalContract = internalContract
        this._status = STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN
    }
}
