import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { ProductImage } from '../components/ProductImage'
import { AccountBottomSheet } from '../components/AccountBottomSheet'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)

export function Favoritos() {
  const { user } = useAuth()
  const { favoriteIds, toggleFavorite, loading } = useFavorites()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const [sheetOpen, setSheetOpen] = useState(false)

  // Si no hay sesión, mostramos el bottom sheet directamente al montar
  React.useEffect(() => {
    if (!user) {
      setSheetOpen(true)
    }
  }, [user])

  const favProducts = products.filter((p) => favoriteIds.has(p.id))

  if (!user) {
    return (
      <>
        <div className="page-section">
          <h1 className="page-title">Favoritos</h1>
          <div className="favorites-guest">
            <div className="favorites-icon-wrap" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="favorites-empty-text">Iniciá sesión para ver y guardar tus favoritos.</p>
            <div className="favorites-guest-actions">
              <Link to="/registro" className="btn-primary">Crear cuenta</Link>
              <Link to="/login" className="btn-secondary">Iniciar sesión</Link>
            </div>
          </div>
        </div>
        <AccountBottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
      </>
    )
  }

  if (loading) {
    return (
      <div className="page-section" aria-busy="true">
        <h1 className="page-title">Favoritos</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="favorite-item-skeleton skeleton-line" style={{ height: 72, borderRadius: 12, marginBottom: 12 }} />
        ))}
      </div>
    )
  }

  if (favProducts.length === 0) {
    return (
      <div className="page-section">
        <h1 className="page-title">Favoritos</h1>
        <div className="favorites-empty">
          <div className="favorites-icon-wrap" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="favorites-empty-title">No guardaste ninguna pieza todavía</p>
          <p className="favorites-empty-text">Tocá el corazón en cualquier producto para guardarlo acá.</p>
          <Link to="/catalogo" className="btn-primary favorites-cta">Ir al catálogo</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <h1 className="page-title">Favoritos</h1>
      <ul className="favorites-list" aria-label="Tus productos favoritos">
        {favProducts.map((product) => {
          const isOutOfStock = product.stock === 0
          return (
            <li key={product.id} className="favorite-item">
              <Link
                to={`/producto/${product.id}`}
                className="favorite-item-img-link"
                aria-label={`Ver detalle de ${product.name}`}
              >
                <ProductImage
                  src={product.image_url}
                  alt={`Fotografía de ${product.name}`}
                  className="favorite-item-img"
                />
              </Link>

              <div className="favorite-item-info">
                <Link to={`/producto/${product.id}`} className="favorite-item-name-link">
                  <span className="favorite-item-name">{product.name}</span>
                </Link>
                <span className="favorite-item-price">{formatPrice(product.price)}</span>
                {product.material && (
                  <span className="favorite-item-material">{product.material}</span>
                )}
              </div>

              <div className="favorite-item-actions">
                {/* Agregar al carrito */}
                <button
                  type="button"
                  className="favorite-add-btn"
                  onClick={() => { if (!isOutOfStock) addToCart(product.id, 1) }}
                  disabled={isOutOfStock}
                  aria-label={isOutOfStock ? `Sin stock de ${product.name}` : `Agregar ${product.name} al carrito`}
                  title={isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </button>

                {/* Quitar de favoritos */}
                <button
                  type="button"
                  className="favorite-remove-btn"
                  onClick={() => toggleFavorite(product.id)}
                  aria-label={`Quitar ${product.name} de favoritos`}
                  title="Quitar de favoritos"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
