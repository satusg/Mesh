import { CustomerId } from './CustomerId'
import { Email } from './Email'

interface CustomerProps {
  customerId: CustomerId
  email: Email
  fullName: string
}

export class Customer {
  private constructor(private readonly props: CustomerProps) {}

  static create(email: string, fullName: string): Customer {
    const trimmed = fullName.trim()
    if (trimmed.length < 2) throw new Error('Full name must be at least 2 characters')
    return new Customer({
      customerId: CustomerId.create(),
      email: Email.create(email),
      fullName: trimmed,
    })
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props)
  }

  get customerId(): CustomerId { return this.props.customerId }
  get email(): Email           { return this.props.email }
  get fullName(): string       { return this.props.fullName }
}
