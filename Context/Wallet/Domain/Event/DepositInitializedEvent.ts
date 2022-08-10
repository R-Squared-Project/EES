import DomainEventInterface from "../../../Core/Domain/Events/DomainEventInterface";
import DepositId from "../DepositId";

export default class DepositInitializedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public sessionId: string
    ) {}
}