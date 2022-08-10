import DomainEventInterface from "../../../Core/Domain/Events/DomainEventInterface";

export default class DepositConfirmedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public txHash: string,
        public revpopAccount: string
    ) {}
}