import DomainEventInterface from "../../Core/Domain/Events/DomainEventInterface";

export default class IncomingContractProcessedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public depositId: string
    ) {}

    static eventName(): string {
        return "incoming_contract_processed_event";
    }
}
