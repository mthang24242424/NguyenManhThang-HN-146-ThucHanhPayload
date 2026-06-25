export type PaymentMethod = 'ZALOPAY' | 'PAYPAL' | 'COD'

export type CreatePaymentPayload = {
  orderId: string
  amount: number
  paymentMethod: PaymentMethod
  returnUrl: string
}

export type CreatePaymentResponse = {
  success: boolean
  message: string
  data?: {
    payUrl: string
  }
}

const API_ENDPOINT = '/api/v1/checkout/create-payment'

export async function createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResponse> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = `Create payment failed with status ${response.status}`
    throw new Error(message)
  }

  const data = (await response.json()) as CreatePaymentResponse
  return data
}
