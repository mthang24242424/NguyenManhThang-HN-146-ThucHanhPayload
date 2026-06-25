import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPayment, type PaymentMethod } from '../services/paymentService'
import './CheckoutPage.css'

type FormData = {
  fullName: string
  phone: string
  email: string
  address: string
  note: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const items = [
    { id: 1, name: 'Áo thun basic', price: 180000, qty: 2 },
    { id: 2, name: 'Quần jean slim fit', price: 420000, qty: 1 },
  ]

  const orderId = useMemo(() => `ORD-${Math.floor(100000 + Math.random() * 900000)}`, [])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  )
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const discount = 50000
  const total = subtotal + shippingFee - discount

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.trim()) nextErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!/(84|0[3|5|7|8|9])[0-9]{8}\b/.test(form.phone.trim())) {
      nextErrors.phone = 'Số điện thoại không hợp lệ'
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Email không hợp lệ'
    }

    if (!form.address.trim()) nextErrors.address = 'Vui lòng nhập địa chỉ nhận hàng'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (!agree) {
      alert('Bạn cần đồng ý điều khoản trước khi thanh toán.')
      return
    }

    if (paymentMethod === 'COD') {
      navigate(`/payment-result?status=success&orderId=${orderId}`)
      return
    }

    try {
      setIsLoading(true)

      const response = await createPayment({
        orderId,
        amount: total,
        paymentMethod,
        returnUrl: `${window.location.origin}/payment-result`,
      })

      const payUrl = response.data?.payUrl
      if (!payUrl) {
        throw new Error('Không nhận được payUrl từ backend')
      }

      window.location.href = payUrl
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tạo thanh toán.'
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="checkout-page">
      <h1>Thanh toán</h1>

      <div className="checkout-layout">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Thông tin giao hàng</h2>

          <label>
            Họ và tên *
            <input
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Nguyễn Văn A"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <small>{errors.fullName}</small>}
          </label>

          <div className="grid-2">
            <label>
              Số điện thoại *
              <input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="09xxxxxxxx"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <small>{errors.phone}</small>}
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="abc@gmail.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <small>{errors.email}</small>}
            </label>
          </div>

          <label>
            Địa chỉ nhận hàng *
            <input
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <small>{errors.address}</small>}
          </label>

          <label>
            Ghi chú
            <textarea
              value={form.note}
              onChange={(e) => handleChange('note', e.target.value)}
              placeholder="Ví dụ: giao ngoài giờ hành chính..."
            />
          </label>

          <h2>Phương thức thanh toán</h2>
          <label className="row">
            <input
              type="radio"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
            />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label className="row">
            <input
              type="radio"
              checked={paymentMethod === 'ZALOPAY'}
              onChange={() => setPaymentMethod('ZALOPAY')}
            />
            ZaloPay
          </label>
          <label className="row">
            <input
              type="radio"
              checked={paymentMethod === 'PAYPAL'}
              onChange={() => setPaymentMethod('PAYPAL')}
            />
            PayPal
          </label>

          <label className="row agree">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            Tôi đồng ý với điều khoản mua hàng
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </form>

        <aside className="card">
          <h2>Đơn hàng của bạn</h2>
          <p>
            <strong>Mã đơn:</strong> {orderId}
          </p>
          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} x{item.qty}
              </span>
              <strong>{formatVND(item.price * item.qty)}</strong>
            </div>
          ))}

          <hr />
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatVND(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
          </div>
          <div className="summary-row">
            <span>Giảm giá</span>
            <span>- {formatVND(discount)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Tổng cộng</span>
            <span>{formatVND(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  )
}
