export enum OrderStatus {
  PENDING          = 'PENDING',           // created, not yet initiated payment
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',  // payment intent created
  PAID             = 'PAID',              // payment confirmed via webhook
  FULFILLED        = 'FULFILLED',         // license delivered
  FAILED           = 'FAILED',            // payment failed
}
