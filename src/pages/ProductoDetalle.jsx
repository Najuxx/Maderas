import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { ProductImage } from '../components/ProductImage'
import { ProductCard } from '../components/ProductCard'
import { ProductZoomModal } from '../components/ProductZoomModal'
import { AccountBottomSheet } from '../components/AccountBottomSheet'
import { NotFound } from './NotFound'

export function ProductoDetalle() {
  const { id } = useParams()
  const { products: allProducts } = useProducts()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [sheetOpen, setSheetOpen] = useState(false)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [addedNotice, setAddedNotice] = useState(false)

  const imageBtnRef = useRef(null)

  const favBtnRef = useRef(null)
  const favActive = product ? isFavorite(product.id) : false

  const handleFavorite = () => {
    if (!user) {
      setSheetOpen(true)
      return
    }
    if (product) toggleFavorite(product.id)
  }

  // Cargar producto desde Supabase por ID (funciona directo por URL y al refrescar)
  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      setLoading(true)
      setNotFound(false)
      setAddedNotice(false)
      setQty(1)

      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, description, price, category, material, image_url, stock, featured, created_at')
          .eq('id', id)
          .single()

        if (error || !data) {
          if (isMounted) setNotFound(true)
        } else {
          if (isMounted) setProduct(data)
        }
      } catch (err) {
        console.error('Error al cargar producto:', err)
        if (isMounted) setNotFound(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="product-detail-page" aria-busy="true">
        <div className="skeleton-image skeleton-detail-img" />
        <div className="skeleton-line" style={{ width: '70%', height: '24px', margin: '16px 0 8px' }} />
        <div className="skeleton-line" style={{ width: '40%', height: '20px', marginBottom: '16px' }} />
        <div className="skeleton-line" style={{ width: '100%', height: '60px' }} />
      </div>
    )
  }

  if (notFound || !product) {
    return <NotFound />
  }

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const maxQty = Math.min(product.stock, 99)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(product.price)

  const handleIncrement = () => {
    setQty((prev) => Math.min(prev + 1, maxQty))
  }

  const handleDecrement = () => {
    setQty((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return
    const success = addToCart(product.id, qty)
    if (success) {
      setAddedNotice(true)
    }
  }

  // Productos relacionados: misma categoría, hasta 4 piezas (excluyendo el actual)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && Number(p.id) !== Number(product.id))
    .slice(0, 4)

  return (
    <article className="product-detail-page">
      {/* Contenedor de Imagen Principal con botón para abrir Zoom */}
      <div className="product-detail-image-card">
        <button
          type="button"
          className="product-detail-zoom-trigger"
          onClick={() => setIsZoomOpen(true)}
          ref={imageBtnRef}
          aria-label={`Ampliar imagen de ${product.name}`}
          title="Tocá para ampliar la imagen"
        >
          <ProductImage
            src={product.image_url}
            alt={`Fotografía artesanal de ${product.name}`}
            className="product-detail-img"
          />
          <span className="product-detail-zoom-badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>Ampliar</span>
          </span>
        </button>

        {/* Corazón de favoritos */}
        <button
          ref={favBtnRef}
          type="button"
          className={`product-card-fav-btn product-detail-fav-btn ${favActive ? 'product-card-fav-btn--active' : ''}`}
          aria-label={favActive ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
          aria-pressed={favActive}
          title={favActive ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          onClick={handleFavorite}
        >
          <svg
            width="22"
            height="22"
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

      {/* Modal de Zoom a pantalla completa */}
      <ProductZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageSrc={product.image_url}
        altText={product.name}
        triggerRef={imageBtnRef}
      />

      {/* Información del producto */}
      <section className="product-detail-info">
        <div className="product-detail-meta-tags">
          <span className="product-tag-chip">{product.category}</span>
          {product.material && (
            <span className="product-tag-chip product-tag-material">
              Madera de {product.material}
            </span>
          )}
        </div>

        <h1 className="product-detail-title">{product.name}</h1>

        <div className="product-detail-price-wrap">
          <span className="product-detail-price">{formattedPrice}</span>
          
          {/* Indicador de Disponibilidad */}
          {isOutOfStock ? (
            <span className="stock-pill stock-pill-empty">Sin stock</span>
          ) : isLowStock ? (
            <span className="stock-pill stock-pill-low">Quedan pocas unidades</span>
          ) : (
            <span className="stock-pill stock-pill-ok">Disponible</span>
          )}
        </div>

        <p className="product-detail-desc">{product.description}</p>

        {/* Acciones de compra: Selector de cantidad y Botón principal */}
        <div className="product-detail-actions">
          <div className="quantity-selector-wrap" aria-label="Selector de cantidad">
            <button
              type="button"
              className="qty-btn"
              onClick={handleDecrement}
              disabled={qty <= 1 || isOutOfStock}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="qty-value" aria-live="polite" aria-label={`Cantidad seleccionada: ${qty}`}>
              {qty}
            </span>
            <button
              type="button"
              className="qty-btn"
              onClick={handleIncrement}
              disabled={qty >= maxQty || isOutOfStock}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary product-detail-add-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sin stock disponible' : 'Agregar al carrito'}
          </button>
        </div>

        {/* Aviso accesible al agregar */}
        {addedNotice && (
          <div className="added-to-cart-notice" role="status" aria-live="polite">
            <span className="notice-icon">✓</span>
            <span className="notice-text">
              Agregaste <strong>{qty} {qty === 1 ? 'unidad' : 'unidades'}</strong> de {product.name} al carrito.
            </span>
            <Link to="/carrito" className="notice-cart-link">
              Ver carrito
            </Link>
          </div>
        )}
      </section>

      {/* Productos relacionados (misma categoría, hasta 4) */}
      {relatedProducts.length > 0 && (
        <section className="related-section" aria-labelledby="related-title">
          <h2 id="related-title" className="related-title">
            Piezas relacionadas
          </h2>
          <div className="product-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Panel inferior para usuarios no registrados */}
      <AccountBottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} triggerRef={favBtnRef} />
    </article>
  )
}
