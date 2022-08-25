import DomainEventInterface from "../../../Core/Domain/Events/DomainEventInterface";

export default class DepositRedeemedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public txHash: string
    ) {}

    static eventName(): string {
        return "revpop_deposit_redeemed_event";
    }
}