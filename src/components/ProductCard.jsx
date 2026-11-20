import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ProductImage } from './ProductImage'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { AccountBottomSheet } from './AccountBottomSheet'

export function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [sheetOpen, setSheetOpen] = useState(false)
  const favBtnRef = useRef(null)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(product.price)

  const isOutOfStock = product.stock === 0
  const favActive = isFavorite(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock) {
      addToCart(product.id, 1)
    }
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      setSheetOpen(true)
      return
    }
    toggleFavorite(product.id)
  }

  return (
    <>
      <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
        <div className="product-card-image-wrap">
          <Link
            to={`/producto/${product.id}`}
            className="product-card-link-img"
            aria-label={`Ver detalle de ${product.name}`}
            tabIndex="-1"
          >
            <ProductImage
              src={product.image_url}
              alt={`Fotografía de ${product.name}`}
              className="product-card-img"
            />
          </Link>

          {/* Badge si no hay stock */}
          {isOutOfStock && (
            <span className="stock-badge stock-empty-badge">Sin stock</span>
          )}

          {/* Corazón de favoritos */}
          <button
            ref={favBtnRef}
            type="button"
            className={`product-card-fav-btn ${favActive ? 'product-card-fav-btn--active' : ''}`}
            aria-label={favActive ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
            aria-pressed={favActive}
            title={favActive ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            onClick={handleFavorite}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={favActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className="product-card-info">
          <Link
            to={`/producto/${product.id}`}
            className="product-card-title-link"
          >
            <h3 className="product-card-name" title={product.name}>
              {product.name}
            </h3>
          </Link>

          <div className="product-card-footer">
            <div className="product-card-price-row">
              <span className="product-card-price">{formattedPrice}</span>
              {product.material && (
                <span className="product-card-material">{product.material}</span>
              )}
            </div>

            {/* Botón de 48px para agregar al carrito directamente desde la tarjeta */}
            <button
              type="button"
              className="product-card-add-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={`Agregar ${product.name} al carrito`}
              title={isOutOfStock ? 'Sin stock disponible' : `Agregar ${product.name} al carrito`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AccountBottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} triggerRef={favBtnRef} />
    </>
  )
}
