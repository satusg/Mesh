export interface InitiatePaymentResult {
  /** Mesh: short-lived link token passed to openLink() on the frontend */
  linkToken?: string
  /** Internal gateway reference stored on the order */
  gatewayReference: string
}
