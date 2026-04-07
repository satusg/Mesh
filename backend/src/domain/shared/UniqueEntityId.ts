import { v4 as uuidv4 } from 'uuid'

export class UniqueEntityId {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value ?? uuidv4()
  }

  get value(): string {
    return this._value
  }

  equals(other: UniqueEntityId): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}
