import HandlerInterface from "../../Core/Domain/Events/HandlerInterface";
import DomainEvents from "../../Core/Domain/Events/DomainEvents";
import DepositConfirmedEvent from "../../Wallet/Domain/Event/DepositConfirmedEvent";
import {ConfirmDepositByUser, confirmDepositByUserHandler} from "../index";

export class AfterDepositConfirmedByUser implements HandlerInterface<DepositConfirmedEvent> {
    constructor() {
        this.setupSubscriptions();
    }

    setupSubscriptions() {
        // @ts-ignore
        DomainEvents.register(this.onDepositConfirmedByUserEvent.bind(this), DepositConfirmedEvent.eventName());
    }

    private async onDepositConfirmedByUserEvent(event: DepositConfirmedEvent) {
        const command = new ConfirmDepositByUser(
            event.txHash,
            event.hashLock,
            event.revpopAccount
        )

        const result = await confirmDepositByUserHandler.execute(command)

        if (result.isLeft()) {
            // Send notification
        }
    }
}