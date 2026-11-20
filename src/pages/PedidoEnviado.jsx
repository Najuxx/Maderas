import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function PedidoEnviado() {
  const location = useLocation()
  const { clearCart } = useCart()

  const state = location.state || {}
  const { waUrl, orderSummary } = state

  // Vaciar el carrito al llegar a la confirmación exitosa
  useEffect(() => {
    clearCart()
  }, [clearCart])

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val || 0)

  const handleReopenWhatsapp = () => {
    if (waUrl) {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="order-result-page">
      <div className="order-result-icon success" aria-hidden="true">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="order-result-title">Pedido enviado</h1>
      <p className="order-result-subtitle">
        Abrimos WhatsApp con tu pedido. Enviá el mensaje para que lo confirmemos.
      </p>

      {/* Resumen del pedido si está disponible */}
      {orderSummary && (
        <section className="checkout-card order-summary-result" aria-labelledby="sent-summary-title">
          <h2 id="sent-summary-title" className="checkout-section-title">
            Detalle del pedido enviado
          </h2>

          <ul className="checkout-items-list">
            {orderSummary.items?.map((item) => (
              <li key={item.id} className="checkout-item-row">
                <div className="checkout-item-info">
                  <span className="checkout-item-qty">{item.qty} ×</span>
                  <span className="checkout-item-name">{item.name}</span>
                </div>
                <span className="checkout-item-price">{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-totals">
            <div className="checkout-totals-row checkout-total-final">
              <strong>Total</strong>
              <strong>{formatPrice(orderSummary.total)}</strong>
            </div>
          </div>

          {orderSummary.nombre && (
            <p className="order-meta-info">
              <strong>A nombre de:</strong> {orderSummary.nombre}
            </p>
          )}
          {orderSummary.aclaraciones && (
            <p className="order-meta-info">
              <strong>Aclaraciones:</strong> {orderSummary.aclaraciones}
            </p>
          )}
        </section>
      )}

      {/* Acciones principales */}
      <div className="order-result-actions">
        {waUrl && (
          <button
            type="button"
            className="btn btn-secondary order-action-btn"
            onClick={handleReopenWhatsapp}
          >
            Abrir WhatsApp de nuevo
          </button>
        )}

        <Link to="/catalogo" className="btn btn-primary order-action-btn">
          Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
