import Entity from "./Entity";
import DomainEventInterface from "./Events/DomainEventInterface";
import DomainEvents from "./Events/DomainEvents";
import UniqueEntityID from "./UniqueEntityID";

export default abstract class AggregateRoot extends Entity {
    private _domainEvents: DomainEventInterface[] = [];

    get id(): UniqueEntityID {
        return this._id;
    }

    get domainEvents(): DomainEventInterface[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: DomainEventInterface): void {
        this._domainEvents.push(domainEvent);
        DomainEvents.markAggregateForDispatch(this);
        // this.logDomainEventAdded(domainEvent);
    }

    public clearEvents(): void {
        this._domainEvents.splice(0, this._domainEvents.length);
    }

    // private logDomainEventAdded(domainEvent: DomainEventInterface): void {
    //     const thisClass = Reflect.getPrototypeOf(this);
    //     const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    //
    //     if (thisClass !== null && domainEventClass !== null) {
    //         console.info(`[Domain Event Created]:`, thisClass.constructor.name, '==>', domainEventClass.constructor.name)
    //     }
    // }

    // For TypeOrm
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    set id(id: UniqueEntityID) {
        this._id = id;
    }
}