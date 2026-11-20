import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function CartToast() {
  const { toastMessage, dismissToast } = useCart()

  if (!toastMessage) return null

  return (
    <div
      className="cart-toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="cart-toast-content">
        <span className="cart-toast-icon" aria-hidden="true">✓</span>
        <div className="cart-toast-text">
          <strong className="cart-toast-name">{toastMessage.name}</strong>
          <span>{toastMessage.text}</span>
        </div>
      </div>
      <div className="cart-toast-actions">
        <Link to="/carrito" className="cart-toast-link" onClick={dismissToast}>
          Ver carrito
        </Link>
        <button
          type="button"
          className="cart-toast-close"
          onClick={dismissToast}
          aria-label="Cerrar aviso"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
