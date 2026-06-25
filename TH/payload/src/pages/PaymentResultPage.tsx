import { Link, useSearchParams } from 'react-router-dom'
import './PaymentResult.css'

type PaymentStatus = 'success' | 'failed' | 'cancelled'

function getStatusText(status: PaymentStatus) {
  if (status === 'success') {
    return {
      title: 'Thanh toán thành công',
      description: 'Cảm ơn bạn đã hoàn tất thanh toán. Đơn hàng đang được xử lý.',
      icon: '✅',
      ctaText: 'Về trang chủ',
      ctaLink: '/',
    }
  }

  if (status === 'cancelled') {
    return {
      title: 'Bạn đã hủy thanh toán',
      description: 'Bạn có thể quay lại để chọn phương thức thanh toán khác.',
      icon: '⚠️',
      ctaText: 'Thử lại',
      ctaLink: '/',
    }
  }

  return {
    title: 'Thanh toán thất bại',
    description: 'Giao dịch chưa thành công. Vui lòng kiểm tra lại và thử lại.',
    icon: '❌',
    ctaText: 'Thử lại',
    ctaLink: '/',
  }
}

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams()

  const statusParam = searchParams.get('status')
  const orderId = searchParams.get('orderId') ?? 'N/A'
  const reason = searchParams.get('reason')

  const status: PaymentStatus =
    statusParam === 'success' || statusParam === 'cancelled' ? statusParam : 'failed'

  const content = getStatusText(status)

  return (
    <main className="payment-result-page">
      <section className="payment-result-card">
        <div className="payment-result-icon">{content.icon}</div>
        <h1>{content.title}</h1>
        <p>{content.description}</p>

        <div className="payment-result-meta">
          <p>
            <strong>Mã đơn hàng:</strong> {orderId}
          </p>
          {reason && (
            <p>
              <strong>Lý do:</strong> {reason}
            </p>
          )}
        </div>

        <Link to={content.ctaLink} className="payment-result-btn">
          {content.ctaText}
        </Link>
      </section>
    </main>
  )
}
