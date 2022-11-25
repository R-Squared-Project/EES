import DomainEventInterface from "../../Core/Domain/Events/DomainEventInterface";

export default class DepositCreatedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public depositId: string
    ) {}

    static eventName(): string {
        return "deposit_created_event";
    }
}
