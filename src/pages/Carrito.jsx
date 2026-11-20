import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ProductImage } from '../components/ProductImage'

export function Carrito() {
  const {
    cartItems,
    subtotal,
    total,
    updateQty,
    removeFromCart,
    undoRemove,
    lastRemoved,
    dismissUndo,
  } = useCart()

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val)

  // ESTADO VACÍO (carrito-vacio.png y correcciones de la sección 10)
  if (cartItems.length === 0 && !lastRemoved) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-icon-wrap" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>

        <h1 className="cart-empty-title">Tu carrito está vacío</h1>
        <p className="cart-empty-desc">
          Aún no agregaste piezas de madera a tu compra. Explorá nuestro catálogo artesanal y encontrá la ideal para vos.
        </p>

        <Link to="/catalogo" className="btn btn-primary cart-empty-btn">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">Carrito de compras</h1>
        <span className="cart-items-count">
          {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
        </span>
      </header>

      {/* Banner de Deshacer eliminación por 5 segundos */}
      {lastRemoved && (
        <div className="cart-undo-banner" role="status" aria-live="polite">
          <div className="undo-content">
            <span className="undo-icon">🗑️</span>
            <span>Quitaste <strong>{lastRemoved.name}</strong></span>
          </div>
          <div className="undo-actions">
            <button
              type="button"
              className="undo-btn"
              onClick={undoRemove}
              aria-label={`Deshacer eliminación de ${lastRemoved.name}`}
            >
              Deshacer
            </button>
            <button
              type="button"
              className="undo-close-btn"
              onClick={dismissUndo}
              aria-label="Cerrar aviso de deshacer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Listado de ítems del carrito */}
      <section className="cart-items-list" aria-label="Productos en el carrito">
        {cartItems.map((item) => {
          const maxStock = Math.min(item.product.stock, 99)

          return (
            <article key={item.id} className="cart-item-card">
              <Link
                to={`/producto/${item.id}`}
                className="cart-item-thumb-link"
                tabIndex="-1"
                aria-hidden="true"
              >
                <ProductImage
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="cart-item-thumb"
                />
              </Link>

              <div className="cart-item-details">
                <div className="cart-item-header">
                  <Link to={`/producto/${item.id}`} className="cart-item-name-link">
                    <h3 className="cart-item-name">{item.product.name}</h3>
                  </Link>

                  {/* Papelera separada del selector con área táctil de 48px */}
                  <button
                    type="button"
                    className="cart-item-trash-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Quitar ${item.product.name} del carrito`}
                    title="Quitar producto"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>

                {item.product.material && (
                  <span className="cart-item-material">Madera de {item.product.material}</span>
                )}

                <div className="cart-item-bottom">
                  {/* Selector de cantidad (− n +) con área táctil de 48px */}
                  <div className="quantity-selector-wrap cart-qty-wrap" aria-label={`Cantidad para ${item.product.name}`}>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label="Restar una unidad"
                    >
                      −
                    </button>
                    <span className="qty-value" aria-label={`Cantidad: ${item.qty}`}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      disabled={item.qty >= maxStock}
                      aria-label="Sumar una unidad"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price-wrap">
                    <span className="cart-item-subtotal">{formatPrice(item.subtotal)}</span>
                    {item.qty > 1 && (
                      <span className="cart-item-unit-price">
                        {formatPrice(item.product.price)} c/u
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {/* Aviso para invitados sobre puntos */}
      <aside className="cart-guest-notice" role="note">
        <span className="guest-notice-icon" aria-hidden="true">⭐</span>
        <p className="guest-notice-text">
          Con una cuenta, tu compra suma puntos para futuros descuentos.
        </p>
      </aside>

      {/* Resumen y botón principal "Finalizar pedido" */}
      <section className="cart-summary-card" aria-label="Resumen de compra">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row summary-total-row">
          <span className="summary-total-label">Total</span>
          <span className="summary-total-value">{formatPrice(total)}</span>
        </div>

        <Link
          to="/carrito/confirmar"
          className="btn btn-primary cart-checkout-btn"
        >
          Finalizar pedido
        </Link>

        <Link to="/catalogo" className="btn btn-outline cart-continue-btn">
          Seguir explorando
        </Link>
      </section>
    </div>
  )
}
