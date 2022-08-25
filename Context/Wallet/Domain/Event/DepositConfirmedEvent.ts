import DomainEventInterface from "../../../Core/Domain/Events/DomainEventInterface";

export default class DepositConfirmedEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public txHash: string,
        public revpopAccount: string,
        public hashLock: string
    ) {}

    static eventName(): string {
        return "wallet_deposit_confirmed_event";
    }
}