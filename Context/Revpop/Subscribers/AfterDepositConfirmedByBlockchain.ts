import HandlerInterface from "../../Core/Domain/Events/HandlerInterface";
import DomainEvents from "../../Core/Domain/Events/DomainEvents";
import DepositCreatedEvent from "../../Eth/Domain/Event/DepositCreatedEvent";
import {ConfirmDepositByBlockchain, confirmDepositByBlockchainHandler} from "../index";

export class AfterDepositConfirmedByBlockchain implements HandlerInterface<DepositCreatedEvent> {
    constructor() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        // @ts-ignore
        DomainEvents.register(this.onDepositConfirmedByBlockchainEvent.bind(this), DepositCreatedEvent.eventName());
    }

    private async onDepositConfirmedByBlockchainEvent(event: DepositCreatedEvent) {
        const command = new ConfirmDepositByBlockchain(event.txHash, event.value, event.hashLock)

        const result = await confirmDepositByBlockchainHandler.execute(command)

        if (result.isLeft()) {
            // Send notification
        }
    }
}