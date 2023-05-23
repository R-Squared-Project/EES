import DomainEvents from "context/Core/Domain/Events/DomainEvents";
import HandlerInterface from "context/Core/Domain/Events/HandlerInterface";
import IncomingContractRedeemedEvent from "context/Domain/Event/IncomingContractRedeemedEvent";
import RabbitMQ from "context/Queue/RabbitMQ";

export default class AfterIncomingContractRedeemed implements HandlerInterface<IncomingContractRedeemedEvent> {
    private readonly sender: RabbitMQ;

    constructor() {
        this.sender = new RabbitMQ();
        this.sender.initProduce().then(() => {
            this.setupSubscriptions();
        });
    }

    setupSubscriptions() {
        //@ts-ignore
        DomainEvents.register(this.onDepositRedeemedEvent.bind(this), IncomingContractRedeemedEvent.eventName());
    }

    private async onDepositRedeemedEvent(event: IncomingContractRedeemedEvent) {
        await this.sender.publish("deposit_redeemed_in_internal_blockchain", {
            withdraw_id: event.depositId,
        });
    }
}
