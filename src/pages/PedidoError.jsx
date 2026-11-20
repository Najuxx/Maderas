import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

export function PedidoError() {
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  const state = location.state || {}
  const { reason, waUrl, message } = state

  const handleRetry = () => {
    if (waUrl) {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    } else {
      window.location.reload()
    }
  }

  const handleCopyMessage = async () => {
    if (!message) return
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 3500)
    } catch {
      // Fallback si clipboard API no está permitida
      const textArea = document.createElement('textarea')
      textArea.value = message
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3500)
    }
  }

  return (
    <div className="order-result-page">
      <div className="order-result-icon error" aria-hidden="true">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <h1 className="order-result-title">No pudimos abrir WhatsApp</h1>
      
      <p className="order-result-subtitle">
        {reason === 'missing_number'
          ? 'No se encuentra configurado el número de WhatsApp de contacto en la tienda.'
          : 'Es posible que tu navegador haya bloqueado la pestaña emergente automática.'}
      </p>

      {/* Caja de texto con el pedido formateado */}
      {message && (
        <section className="checkout-card error-message-box" aria-labelledby="msg-heading">
          <h2 id="msg-heading" className="checkout-section-title">
            Mensaje de tu pedido
          </h2>
          <pre className="error-message-pre">{message}</pre>
        </section>
      )}

      {/* Notificación de copiado */}
      {copied && (
        <div className="cart-undo-banner" role="status" aria-live="polite">
          <span>✓ ¡Mensaje copiado al portapapeles! Ya podés pegarlo en WhatsApp.</span>
        </div>
      )}

      {/* Botones de acción */}
      <div className="order-result-actions">
        {waUrl && (
          <button
            type="button"
            className="btn btn-primary order-action-btn"
            onClick={handleRetry}
          >
            Reintentar abrir WhatsApp
          </button>
        )}

        {message && (
          <button
            type="button"
            className="btn btn-secondary order-action-btn"
            onClick={handleCopyMessage}
          >
            {copied ? '¡Copiado!' : 'Copiar mensaje'}
          </button>
        )}

        <Link to="/carrito" className="btn btn-outline order-action-btn">
          Volver al carrito
        </Link>
      </div>
    </div>
  )
}
