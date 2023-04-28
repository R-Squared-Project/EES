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
    public secret: string | null = null;
    public status: number;
    public externalContract: ExternalContract | null = null;
    constructor(
        public withdrawRequest: WithdrawRequest,
        public internalContract: InternalContract,
        public htlcCreateOperationId: string,
        public transferOperationId: string
    ) {
        super();
        this.status = STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN;
    }

    static create(
        withdrawRequest: WithdrawRequest,
        internalContract: InternalContract,
        htlcCreateOperationId: string,
        transferOperationId: string
    ) {
        return new Withdraw(withdrawRequest, internalContract, htlcCreateOperationId, transferOperationId);
    }
}
