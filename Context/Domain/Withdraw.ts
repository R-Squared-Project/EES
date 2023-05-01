import AggregateRoot from "context/Core/Domain/AggregateRoot";
import WithdrawRequest from "./WithdrawRequest";
import ExternalContract from "./ExternalContract";
import InternalContract from "context/Domain/InternalContract";
import ReadyToProcess from "context/Domain/Validation/Withdraw/ReadyToProcess";

export const STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN = 5;
export const STATUS_READY_TO_PROCESS = 10;
export const STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN = 15;
export const STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN = 20;
export const STATUS_COMPLETED = 25;
export const STATUS_BURNED = 105;
export const STATUS_FAILED_PROCESSING = 200;

export default class Withdraw extends AggregateRoot {
    public secret: string | null = null;
    public status: number;
    public externalContract: ExternalContract | null = null;
    public errorMessage: string | null = null;
    public hashlock: string | null = null;
    public timelock: number | null = null;
    public amountOfHTLC: number | null = null;
    public amountOfWithdrawalFee: number | null = null;
    public assetOfWithdrawalFee: string | null = null;

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

    public error(message: string) {
        this.status = STATUS_FAILED_PROCESSING;
        this.errorMessage = message;
    }

    public readyToProcess(
        hashlock: string,
        timelock: number,
        amountOfHtlc: number,
        amountOfWithdrawalFee: number,
        assetOfWithdrawalFee: string
    ) {
        this.hashlock = hashlock;
        this.timelock = timelock;
        this.amountOfHTLC = amountOfHtlc;
        this.amountOfWithdrawalFee = amountOfWithdrawalFee;
        this.assetOfWithdrawalFee = assetOfWithdrawalFee;
        new ReadyToProcess(this).validate();
        this.status = STATUS_READY_TO_PROCESS;
    }
}
