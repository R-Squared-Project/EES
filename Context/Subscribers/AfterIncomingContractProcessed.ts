import DomainEvents from "context/Core/Domain/Events/DomainEvents";
import HandlerInterface from "context/Core/Domain/Events/HandlerInterface";
import IncomingContractProcessedEvent from "context/Domain/Event/IncomingContractProcessedEvent";
import RabbitMQ from "context/Queue/RabbitMQ";

export class AfterIncomingContractProcessed implements HandlerInterface<IncomingContractProcessedEvent> {
    private readonly sender: RabbitMQ

    constructor() {
        this.sender = new RabbitMQ()
        this.sender.initProduce().then(() => {
            this.setupSubscriptions();
        })
    }

    setupSubscriptions() {
        //@ts-ignore
        DomainEvents.register(this.onDepositConfirmedEvent.bind(this), IncomingContractProcessedEvent.eventName());
    }

    private async onDepositConfirmedEvent(event: IncomingContractProcessedEvent) {
        await this.sender.publish('create_in_internal_blockchain', {
            deposit_id: event.depositId
        })
    }
}
