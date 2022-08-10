import HandlerInterface from "../../Core/Domain/Events/HandlerInterface";
import DomainEvents from "../../Core/Domain/Events/DomainEvents";
import DepositConfirmedEvent from "../../Wallet/Domain/Event/DepositConfirmedEvent";
import {CreateDeposit, createDepositHandler} from "../index";

export class AfterDepositConfirmed implements HandlerInterface<DepositConfirmedEvent> {
    constructor() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        // @ts-ignore
        DomainEvents.register(this.onDepositConfirmedEvent.bind(this), DepositConfirmedEvent.name);
    }

    private onDepositConfirmedEvent(event: DepositConfirmedEvent) {
        const command = new CreateDeposit(
            event.txHash,
            event.revpopAccount
        )

        const result = createDepositHandler.execute(command)

        if (result.isLeft()) {
            // Send notification
        }
    }
}