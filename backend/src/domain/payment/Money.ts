export class Money {
  private constructor(
    private readonly _amount: number,   // in cents / smallest currency unit
    private readonly _currency: string, // ISO 4217
  ) {
    if (_amount < 0) throw new Error('Money amount cannot be negative')
    if (!/^[A-Z]{3}$/.test(_currency)) throw new Error(`Invalid currency code: ${_currency}`)
  }

  static of(amount: number, currency: string): Money {
    return new Money(amount, currency.toUpperCase())
  }

  get amount(): number {
    return this._amount
  }

  get currency(): string {
    return this._currency
  }

  /** Human-readable decimal string, e.g. "9900" → "99.00" */
  get formatted(): string {
    return (this._amount / 100).toFixed(2)
  }

  add(other: Money): Money {
    this.assertSameCurrency(other)
    return new Money(this._amount + other._amount, this._currency)
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error(`Currency mismatch: ${this._currency} vs ${other._currency}`)
    }
  }
}
