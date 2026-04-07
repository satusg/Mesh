export interface ConfirmPaymentCommand {
  /** Raw webhook body buffer (needed for signature verification) */
  rawPayload: Buffer
  /** Gateway-specific signature header value */
  signature: string
  /** Which gateway sent this webhook */
  gatewayType: 'mesh'
}
