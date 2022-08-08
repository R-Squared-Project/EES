import UniqueEntityID from '../UniqueEntityID';

export default interface DomainEventInterface {
    dateTimeOccurred: Date;
    getAggregateId(): UniqueEntityID;
}

