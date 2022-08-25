import DomainEventInterface from "../../../Core/Domain/Events/DomainEventInterface";

export default class DepositInitializedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public sessionId: string
    ) {}

    static eventName(): string {
        return "wallet_deposit_initialized_event";
    }
}