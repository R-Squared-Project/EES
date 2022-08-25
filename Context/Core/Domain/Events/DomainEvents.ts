import DomainEventInterface from "./DomainEventInterface";
import AggregateRoot from "../AggregateRoot";
import UniqueEntityID from "../UniqueEntityID";

export default class DomainEvents {
    private static handlersMap: {
        [index: string]: any
    } = {};
    private static markedAggregates: AggregateRoot[] = [];

    public static markAggregateForDispatch(aggregate: AggregateRoot): void {
        const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

        if (!aggregateFound) {
            this.markedAggregates.push(aggregate);
        }
    }

    private static dispatchAggregateEvents(aggregate: AggregateRoot): void {
        aggregate.domainEvents.forEach((event: DomainEventInterface) => this.dispatch(event));
    }

    private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot): void {
        const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
        this.markedAggregates.splice(index, 1);
    }

    private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot | null {
        let found: AggregateRoot | null = null;
        for (const aggregate of this.markedAggregates) {
            if (aggregate.id.equals(id)) {
                found = aggregate;
            }
        }

        return found;
    }

    public static dispatchEventsForAggregate(id: UniqueEntityID): void {
        const aggregate = this.findMarkedAggregateByID(id);

        if (aggregate) {
            this.dispatchAggregateEvents(aggregate);
            aggregate.clearEvents();
            this.removeAggregateFromMarkedDispatchList(aggregate);
        }
    }

    public static register(callback: (event: DomainEventInterface) => void, eventClassName: string): void {
        if (!Object.prototype.hasOwnProperty.call(this.handlersMap, eventClassName)) {
            this.handlersMap[eventClassName] = [];
        }
        this.handlersMap[eventClassName].push(callback);
    }

    public static clearHandlers(): void {
        this.handlersMap = {};
    }

    public static clearMarkedAggregates(): void {
        this.markedAggregates = [];
    }

    private static dispatch(event: DomainEventInterface): void {
        //@ts-ignore
        const eventClassName: string = event.constructor.eventName();

        if (Object.prototype.hasOwnProperty.call(this.handlersMap, eventClassName)) {
            const handlers: any[] = this.handlersMap[eventClassName];
            for (const handler of handlers) {
                handler(event);
            }
        }
    }
}