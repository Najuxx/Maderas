import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function ConfirmarPedido() {
  const navigate = useNavigate()
  const { cartItems, subtotal, total } = useCart()

  const [nombre, setNombre] = useState('')
  const [aclaraciones, setAclaraciones] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('whatsapp')

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val)

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <h2>No hay productos en tu pedido</h2>
        <p>Tu carrito está vacío. Agregá piezas para poder confirmar tu pedido.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  const handleSendOrder = (e) => {
    e.preventDefault()

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER

    // Construcción del mensaje según sección 7 de DESIGN.md
    const lines = [
      'Hola, quiero hacer este pedido:',
      ...cartItems.map(
        (item) => `• ${item.qty} × ${item.product.name} — ${formatPrice(item.subtotal)}`
      ),
      `Subtotal: ${formatPrice(subtotal)} · Total: ${formatPrice(total)}`,
    ]

    if (nombre.trim()) {
      lines.push(`Nombre: ${nombre.trim()}`)
    }
    if (aclaraciones.trim()) {
      lines.push(`Aclaraciones: ${aclaraciones.trim()}`)
    }

    const fullMessage = lines.join('\n')

    const orderData = {
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.product.name,
        qty: i.qty,
        unitPrice: i.product.price,
        subtotal: i.subtotal,
      })),
      subtotal,
      total,
      nombre: nombre.trim(),
      aclaraciones: aclaraciones.trim(),
    }

    // Si no está configurado el número de WhatsApp, dirigimos al estado de error
    if (!whatsappNumber) {
      navigate('/pedido-error', {
        state: {
          reason: 'missing_number',
          message: fullMessage,
          orderSummary: orderData,
        },
      })
      return
    }

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`

    // Intentar abrir WhatsApp en una pestaña nueva con noopener
    let popupBlocked = false
    try {
      const win = window.open(waUrl, '_blank', 'noopener,noreferrer')
      if (!win || win.closed || typeof win.closed === 'undefined') {
        popupBlocked = true
      }
    } catch {
      popupBlocked = true
    }

    if (popupBlocked) {
      navigate('/pedido-error', {
        state: {
          reason: 'popup_blocked',
          waUrl,
          message: fullMessage,
          orderSummary: orderData,
        },
      })
    } else {
      navigate('/pedido-enviado', {
        state: {
          waUrl,
          message: fullMessage,
          orderSummary: orderData,
        },
      })
    }
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <h1 className="checkout-title">Confirmar pedido</h1>
        <p className="checkout-subtitle">
          Revisá el resumen de tus piezas antes de coordinar el pedido por WhatsApp.
        </p>
      </header>

      {/* Resumen del pedido */}
      <section className="checkout-card" aria-labelledby="order-summary-heading">
        <h2 id="order-summary-heading" className="checkout-section-title">
          Resumen del pedido
        </h2>

        <ul className="checkout-items-list">
          {cartItems.map((item) => (
            <li key={item.id} className="checkout-item-row">
              <div className="checkout-item-info">
                <span className="checkout-item-qty">{item.qty} ×</span>
                <span className="checkout-item-name">{item.product.name}</span>
              </div>
              <span className="checkout-item-price">{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>

        <div className="checkout-totals">
          <div className="checkout-totals-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="checkout-totals-row checkout-total-final">
            <strong>Total</strong>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
      </section>

      {/* Formulario opcional de datos */}
      <form onSubmit={handleSendOrder} className="checkout-form">
        <section className="checkout-card" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="checkout-section-title">
            Datos opcionales para la entrega
          </h2>

          <div className="form-group">
            <label htmlFor="nombre-input" className="form-label">
              Tu nombre (opcional)
            </label>
            <input
              id="nombre-input"
              type="text"
              className="form-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Lucía Gómez"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="aclaraciones-input" className="form-label">
              Aclaraciones o dirección (opcional)
            </label>
            <textarea
              id="aclaraciones-input"
              className="form-textarea"
              value={aclaraciones}
              onChange={(e) => setAclaraciones(e.target.value)}
              placeholder="Ej: Entregar por la tarde o indicaciones especiales para las piezas..."
              rows={3}
            />
          </div>
        </section>

        {/* Medios de pago (pedido-confirmar.png) */}
        <section className="checkout-card" aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="checkout-section-title">
            Métodos de pago
          </h2>

          <div className="payment-options-list" role="radiogroup" aria-label="Métodos de pago">
            {/* Opción WhatsApp Activa */}
            <label className={`payment-option-card ${selectedPayment === 'whatsapp' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment_method"
                value="whatsapp"
                checked={selectedPayment === 'whatsapp'}
                onChange={() => setSelectedPayment('whatsapp')}
                className="payment-radio"
              />
              <div className="payment-option-content">
                <span className="payment-icon-wa" aria-hidden="true">💬</span>
                <div className="payment-text">
                  <strong>WhatsApp (Redirección directa)</strong>
                  <span>Coordiná el pago por transferencia o efectivo al recibir</span>
                </div>
              </div>
            </label>

            {/* Google Pay - Próximamente */}
            <div className="payment-option-card payment-disabled" aria-disabled="true">
              <div className="payment-option-content">
                <span className="payment-icon-disabled" aria-hidden="true">💳</span>
                <div className="payment-text">
                  <strong>Google Pay</strong>
                </div>
              </div>
              <ProximamenteBadge />
            </div>

            {/* Apple Pay - Próximamente */}
            <div className="payment-option-card payment-disabled" aria-disabled="true">
              <div className="payment-option-content">
                <span className="payment-icon-disabled" aria-hidden="true">🍎</span>
                <div className="payment-text">
                  <strong>Apple Pay</strong>
                </div>
              </div>
              <ProximamenteBadge />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="btn btn-primary checkout-submit-btn"
        >
          Enviar pedido por WhatsApp
        </button>
      </form>
    </div>
  )
}
