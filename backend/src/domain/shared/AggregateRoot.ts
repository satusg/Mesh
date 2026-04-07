import { UniqueEntityId } from './UniqueEntityId'
import { DomainEvent } from './DomainEvent'

export abstract class AggregateRoot {
  protected readonly _id: UniqueEntityId
  private _domainEvents: DomainEvent[] = []

  constructor(id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
  }

  get id(): UniqueEntityId {
    return this._id
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents]
    this._domainEvents = []
    return events
  }
}
