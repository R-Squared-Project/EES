import DomainEventInterface from "../../../Core/Domain/events/DomainEventInterface";
import UniqueEntityID from "../../../Core/Domain/UniqueEntityID";
import DepositId from "../DepositId";

export default class DepositConfirmedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public sessionId: DepositId,
        public txHash: string,
        public revpopAccount: string
    ) {}

    public getAggregateId(): UniqueEntityID {
        return this.sessionId.id;
    }
}