import DomainEventInterface from "../../Core/Domain/Events/DomainEventInterface";

export default class IncomingContractRedeemedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public depositId: string
    ) {}

    static eventName(): string {
        return "incoming_contract_redeemed_event";
    }
}
