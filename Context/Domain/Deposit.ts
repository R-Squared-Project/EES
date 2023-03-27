import AggregateRoot from "context/Core/Domain/AggregateRoot";
import DepositRequest from "./DepositRequest";
import ExternalContract from "./ExternalContract";
import InternalContract from "context/Domain/InternalContract";
import IncomingContractProcessedEvent from "context/Domain/Event/IncomingContractProcessedEvent";
import IncomingContractRedeemedEvent from "context/Domain/Event/IncomingContractRedeemedEvent";
import CreateContractInInternalBlockchainValidator from "./Validation/CreateContractInInternalBlockchainValidator";
import ConfirmDepositInternalContractCreatedValidator from "context/Domain/Validation/ConfirmDepositInternalContractCreatedValidator";
import ConfirmDepositInternalContractRedeemedValidator from "./Validation/ConfirmDepositInternalContractRedeemedValidator";
import RedeemExecutedInExternalBlockchainValidator from "./Validation/RedeemExecutedInExternalBlockchainValidator";
import CompletedValidator from "context/Domain/Validation/CompletedValidator";
import RefundedValidator from "context/Domain/Validation/RefundedValidator";
import BurnedValidator from "context/Domain/Validation/BurnedValidator";

export const STATUS_CREATED = 1;
export const STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN = 5;
export const STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN = 10;
export const STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN = 15;
export const STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN = 20;
export const STATUS_COMPLETED = 25;
export const STATUS_BURNED = 100;
export const STATUS_REFUNDED = 105;

export default class Deposit extends AggregateRoot {
    private _secret: string | null = null;
    private _status: number;
    public _internalContract: InternalContract | null = null;
    private _externalBlockchainRedeemTxHash: string | null = null;
    private _internalBlockchainBurnTxHash: string | null = null;
    private _mintedAmount: string | null = null;
    private _burnedAmount: string | null = null;

    constructor(public _depositRequest: DepositRequest, public _externalContract: ExternalContract) {
        super();
        this._status = STATUS_CREATED;
    }

    get internalContract(): InternalContract | null {
        return this._internalContract;
    }

    get status(): number {
        return this._status;
    }

    get secret(): string | null {
        return this._secret;
    }

    get externalBlockchainRedeemTxHash(): string | null {
        return this._externalBlockchainRedeemTxHash;
    }

    get internalBlockchainBurnTxHash(): string | null {
        return this._internalBlockchainBurnTxHash;
    }

    get mintedAmount(): string {
        return this._mintedAmount ?? "";
    }

    get burnedAmount(): string {
        return this._burnedAmount ?? "";
    }

    static create(depositRequest: DepositRequest, externalContract: ExternalContract): Deposit {
        const deposit = new Deposit(depositRequest, externalContract);
        deposit.addDomainEvent(new IncomingContractProcessedEvent(deposit.id.toValue()));

        return deposit;
    }

    public submittedToInternalBlockchain(mintedAmount: string) {
        new CreateContractInInternalBlockchainValidator(this).validate();
        this._status = STATUS_SUBMITTED_TO_INTERNAL_BLOCKCHAIN;
        this._mintedAmount = mintedAmount;
    }

    public createdInInternalBlockchain(internalContract: InternalContract) {
        new ConfirmDepositInternalContractCreatedValidator(this).validate();
        this._internalContract = internalContract;
        this._status = STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN;
    }

    public redeemedInInternalBlockchain(secret: string) {
        new ConfirmDepositInternalContractRedeemedValidator(this).validate();
        this._secret = secret;
        this._status = STATUS_REDEEMED_IN_INTERNAL_BLOCKCHAIN;
        this.addDomainEvent(new IncomingContractRedeemedEvent(this.id.toValue()));
    }

    public redeemExecutedInExternalBlockchain(txHash: string) {
        new RedeemExecutedInExternalBlockchainValidator(this).validate();
        this._externalBlockchainRedeemTxHash = txHash;
        this._status = STATUS_REDEEM_EXECUTED_IN_EXTERNAL_BLOCKCHAIN;
    }

    public completed() {
        new CompletedValidator(this).validate();
        this._status = STATUS_COMPLETED;
    }

    public isSubmittedToInternalBlockchain(): boolean {

        return this._status === STATUS_CREATED_IN_INTERNAL_BLOCKCHAIN;
    }

    public burned(burnedAmount: string) {
        this._burnedAmount = burnedAmount;
        new BurnedValidator(this).validate();
        this._status = STATUS_BURNED;
    }

    public refunded(txHash: string) {
        new RefundedValidator(this).validate();
        this._internalBlockchainBurnTxHash = txHash;
        this._status = STATUS_REFUNDED;
    }
}
