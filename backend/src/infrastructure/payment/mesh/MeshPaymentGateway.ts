import { IPaymentGateway, PaymentInitResult, WebhookEvent } from '../../../application/ports/gateways/IPaymentGateway'
import { Order } from '../../../domain/order/Order'
import { PaymentMethod } from '../../../domain/payment/PaymentMethod'
import { PaymentStatus } from '../../../domain/payment/PaymentStatus'
import { Money } from '../../../domain/payment/Money'

interface MeshLinkTokenResponse {
  status: string
  message?: string
  errorType?: string
  content?: {
    linkToken?: string
  }
  // Some responses may include linkToken at the top level.
  linkToken?: string
}

interface MeshWebhookPayload {
  type: string
  content?: {
    transactionId?: string
    status?: string
    txId?: string
    brokerType?: string
    transferDetails?: {
      status?: string
      transactionId?: string
    }
  }
}

/**
 * Mesh Connect adapter.
 *
 * Flow:
 *   1. createPaymentIntent() → calls /api/v1/linktoken, returns { linkToken, gatewayReference }
 *   2. Frontend calls openLink(linkToken) → user completes transfer in the Mesh iframe
 *   3. Mesh fires a webhook → parseWebhookEvent() normalises it → ConfirmPaymentUseCase fulfils order
 *
 * Docs: https://docs.meshconnect.com/manual
 */
export class MeshPaymentGateway implements IPaymentGateway {
  readonly supportedMethod: PaymentMethod = PaymentMethod.MESH

  private readonly baseUrl: string

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly receivingAddress: string,  // your crypto wallet address
    private readonly networkId: string,          // Mesh network UUID
    private readonly assetSymbol: string,        // e.g. "USDC"
    isSandbox = true,
  ) {
    this.baseUrl = isSandbox
      ? 'https://sandbox-integration-api.meshconnect.com'
      : 'https://integration-api.meshconnect.com'
  }

  // ─── Port implementation ──────────────────────────────────────────────────

  async createPaymentIntent(order: Order): Promise<PaymentInitResult> {
    const request = {
      method: 'POST',
      headers: {
        'X-Client-Id': this.clientId,
        'X-Client-Secret': this.clientSecret,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        userId: order.customer.customerId.value,
        transferOptions: {
          transactionId: order.orderId.value,   // our internal order ID as client reference
          transferType: 'payment',
          toAddresses: [
            {
              symbol: this.assetSymbol,
              address: this.receivingAddress,
              networkId: this.networkId,
            },
          ],
          amountInFiat: order.total.amount / 100, // Mesh expects dollars, not cents
          fundingOptions: { enabled: true },
          clientFee: 0.025,
        },
        restrictMultipleAccounts: true,
        isInclusiveFeeEnabled: false,
      }),
    }

    const res = await fetch(`${this.baseUrl}/api/v1/linktoken`, request)

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Mesh link token request failed (${res.status}): ${body}`)
    }

    const data = (await res.json()) as MeshLinkTokenResponse
    const linkToken = data.content?.linkToken ?? data.linkToken

    if (data.status !== 'ok' || !linkToken) {
      throw new Error(
        `Mesh link token error — status: ${data.status ?? 'unknown'}, token present: ${!!linkToken}, ` +
        `errorType: ${data.errorType ?? 'none'}, message: ${data.message ?? 'none'}.`,
      )
    }

    return {
      // Use orderId as the gateway reference — Mesh uses our transactionId to tie things back
      gatewayReference: order.orderId.value,
      linkToken,
    }
  }

  async capturePayment(_gatewayReference: string): Promise<PaymentStatus> {
    // Mesh transfers are self-contained — capture is not a separate step
    return PaymentStatus.SUCCEEDED
  }

  async refund(_gatewayReference: string, _amount: Money): Promise<void> {
    // Mesh refunds require manual handling via the dashboard or a future API endpoint
    throw new Error('Mesh refunds must be processed manually via the Mesh dashboard')
  }

  // ─── Webhook ──────────────────────────────────────────────────────────────

  verifyWebhookSignature(_payload: Buffer, _signature: string): void {
    // Mesh webhook verification uses the client secret.
    // In production: validate the X-Mesh-Signature header (HMAC-SHA256 of payload).
    // For now, we log and proceed — replace with real verification before going live.
    console.info('[MeshGateway] Webhook signature verification: implement before production')
  }

  async parseWebhookEvent(payload: Buffer): Promise<WebhookEvent> {
    const raw = JSON.parse(payload.toString()) as MeshWebhookPayload

    // Mesh sends different event shapes; normalise to our internal format.
    // Primary reference: https://docs.meshconnect.com/manual#webhooks
    const transactionId =
      raw.content?.transactionId ??
      raw.content?.transferDetails?.transactionId ??
      ''

    const status =
      raw.content?.status ??
      raw.content?.transferDetails?.status ??
      ''

    const succeeded =
      raw.type === 'transfer.completed' ||
      status === 'completed' ||
      status === 'success'

    const failed =
      raw.type === 'transfer.failed' ||
      status === 'failed' ||
      status === 'error'

    if (succeeded) return { type: 'payment.succeeded', gatewayReference: transactionId }
    if (failed) return { type: 'payment.failed', gatewayReference: transactionId }

    // Unhandled type — return empty ref so ConfirmPaymentUseCase silently skips
    return { type: 'payment.failed', gatewayReference: '' }
  }
}
