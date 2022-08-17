import DomainEventInterface from "../../../Core/Domain/Events/DomainEventInterface";

export default class DepositCreatedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public txHash: string,
        public contractId: string,
        public sender: string,
        public receiver: string,
        public value: string,
        public hashLock: string,
        public timelock: number,
    ) {}
}