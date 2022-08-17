import HandlerInterface from "../../Core/Domain/Events/HandlerInterface";
import DomainEvents from "../../Core/Domain/Events/DomainEvents";
import DepositCreatedEvent from "../../Eth/Domain/Event/DepositCreatedEvent";
import {ConfirmDeposit, confirmDepositHandler} from "../index";

export class AfterDepositCreatedByEth implements HandlerInterface<DepositCreatedEvent> {
    constructor() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        // @ts-ignore
        DomainEvents.register(this.onDepositConfirmedEvent.bind(this), DepositCreatedEvent.name);
    }

    private async onDepositConfirmedEvent(event: DepositCreatedEvent) {
        const command = new ConfirmDeposit(event.txHash)

        const result = await confirmDepositHandler.execute(command)

        if (result.isLeft()) {
            // Send notification
        }
    }
}