import DomainEventInterface from "../../Core/Domain/Events/DomainEventInterface";

export default class WithdrawReadyToProcessEvent implements DomainEventInterface {
    public dateTimeOccurred: Date = new Date();

    constructor(public withdrawId: string) {}

    static eventName(): string {
        return "withdraw_ready_to_process_event";
    }
}
