import DomainEventInterface from "./DomainEventInterface";

export default interface HandlerInterface<DomainEventInterface> {
  setupSubscriptions(): void;
}
