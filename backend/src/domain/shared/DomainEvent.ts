export interface DomainEvent {
  readonly occurredAt: Date
  readonly eventName: string
}

export class OrderPaidEvent implements DomainEvent {
  readonly occurredAt = new Date()
  readonly eventName = 'OrderPaid'
  constructor(public readonly orderId: string) {}
}

export class OrderFulfilledEvent implements DomainEvent {
  readonly occurredAt = new Date()
  readonly eventName = 'OrderFulfilled'
  constructor(
    public readonly orderId: string,
    public readonly licenseKey: string,
  ) {}
}
