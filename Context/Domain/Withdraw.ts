import AggregateRoot from "context/Core/Domain/AggregateRoot";
import WithdrawRequest from "./WithdrawRequest";
import ExternalContract from "./ExternalContract";
import InternalContract from "context/Domain/InternalContract";
import ReadyToProcess from "context/Domain/Validation/Withdraw/ReadyToProcess";
import WithdrawReadyToProcessEvent from "context/Domain/Event/WithdrawReadyToProcessEvent";
import SendInReply from "context/Domain/Validation/Withdraw/SendInReply";
import ReadyToSign from "context/Domain/Validation/Withdraw/ReadyToSign";
import WithdrawRedeemed from "context/Domain/Validation/Withdraw/WithdrawRedeemed";
import WithdrawRedeem from "context/Domain/Validation/Withdraw/WithdrawRedeem";
import WithdrawProcessed from "context/Domain/Validation/Withdraw/WithdrawProcesed";
import WithdrawRefund from "context/Domain/Validation/Withdraw/WithdrawRefund";
import WithdrawRefunded from "context/Domain/Validation/Withdraw/WithdrawRefunded";

export const STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN = 5;
export const STATUS_READY_TO_PROCESS = 10;
export const STATUS_SEND_IN_REPLY = 15;
export const STATUS_READY_TO_SIGN = 20;
export const STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN = 25;
export const STATUS_REDEEMED = 30;
export const STATUS_PROCESSED = 35;
export const STATUS_REFUND = 100;
export const STATUS_REFUNDED = 105;
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
    public txHash: string | null = null;
    public externalBlockchainRedeemTxHash: string | null = null;
    public internalRedeemBlockNumber: number | null = null;
    public externalBlockchainRefundTxHash: string | null = null;

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

        this.addDomainEvent(new WithdrawReadyToProcessEvent(this.id.toValue()));
    }

    public sentInReply(txHash: string) {
        this.txHash = txHash;
        new SendInReply(this).validate();
        this.status = STATUS_SEND_IN_REPLY;
    }

    public readyToSign(contract: ExternalContract) {
        this.externalContract = contract;
        new ReadyToSign(this).validate();
        this.status = STATUS_READY_TO_SIGN;
    }

    public isReadyToSign() {
        return this.status == STATUS_READY_TO_SIGN;
    }

    public redeem(externalBlockchainRedeemTxHash: string, preimage: string | undefined) {
        this.externalBlockchainRedeemTxHash = externalBlockchainRedeemTxHash;
        this.secret = preimage ?? null;
        new WithdrawRedeem(this).validate();
        this.status = STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN;
    }

    public redeemed() {
        new WithdrawRedeemed(this).validate();
        this.status = STATUS_REDEEMED;
    }

    public setInternalRedeemBlockNumber(blockNumber: number) {
        this.internalRedeemBlockNumber = blockNumber;
    }

    public processed() {
        new WithdrawProcessed(this).validate();
        this.status = STATUS_PROCESSED;
    }

    public refund(txHash: string) {
        new WithdrawRefund(this).validate();
        this.externalBlockchainRefundTxHash = txHash;
        this.status = STATUS_REFUND;
    }

    public refunded() {
        new WithdrawRefunded(this).validate();
        this.status = STATUS_REFUNDED;
    }
}
