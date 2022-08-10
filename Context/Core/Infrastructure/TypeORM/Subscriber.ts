import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from "typeorm";
import UniqueEntityID from "../../Domain/UniqueEntityID";
import DomainEvents from "../../Domain/Events/DomainEvents";
import AggregateRoot from "../../Domain/AggregateRoot";

const dispatchEventsCallback = (aggregateId: UniqueEntityID) => {
    DomainEvents.dispatchEventsForAggregate(aggregateId);
}

@EventSubscriber()
export default class Subscriber implements EntitySubscriberInterface {
    afterInsert(event: InsertEvent<AggregateRoot>) {
        dispatchEventsCallback(event.entity.id)
    }
}