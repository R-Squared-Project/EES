import DomainEvents from "context/Core/Domain/Events/DomainEvents";
import HandlerInterface from "context/Core/Domain/Events/HandlerInterface";
import RabbitMQ from "context/Queue/RabbitMQ";
import WithdrawReadyToProcessEvent from "context/Domain/Event/WithdrawReadyToProcessEvent";

export default class AfterWithdrawReadyToProcess implements HandlerInterface<WithdrawReadyToProcessEvent> {
    private readonly sender: RabbitMQ;

    constructor() {
        this.sender = new RabbitMQ();
        this.sender.initProduce().then(() => {
            this.setupSubscriptions();
        });
    }

    setupSubscriptions() {
        //@ts-ignore
        DomainEvents.register(this.onWithdrawReadyToProcessEvent.bind(this), WithdrawReadyToProcessEvent.eventName());
    }

    private async onWithdrawReadyToProcessEvent(event: WithdrawReadyToProcessEvent) {
        await this.sender.publish(this.sender.WITHDRAW_READY_TO_PROCESS, {
            withdraw_id: event.withdrawId,
        });
    }
}
