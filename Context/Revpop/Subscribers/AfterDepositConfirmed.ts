import HandlerInterface from "../../Core/Domain/Events/HandlerInterface";
import DomainEvents from "../../Core/Domain/Events/DomainEvents";
import DepositConfirmedEvent from "../Domain/Event/DepositConfirmedEvent";
import {CreateContractInRevpop, createContractInRevpopHandler} from "../index";

export class AfterDepositConfirmed implements HandlerInterface<DepositConfirmedEvent> {
    constructor() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        //@ts-ignore
        DomainEvents.register(this.onDepositConfirmedEvent.bind(this), DepositConfirmedEvent.eventName());
    }

    private async onDepositConfirmedEvent(event: DepositConfirmedEvent) {
        const command = new CreateContractInRevpop(event.txHash)

        const result = await createContractInRevpopHandler.execute(command)

        if (result.isLeft()) {
            // Send notification
        }
    }
}