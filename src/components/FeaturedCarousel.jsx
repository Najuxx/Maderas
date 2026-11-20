import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ProductImage } from './ProductImage'
import { useCart } from '../context/CartContext'

export function FeaturedCarousel({ products = [] }) {
  const carouselRef = useRef(null)
  const { addToCart } = useCart()

  if (!products.length) return null

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const handleAddFeatured = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.stock > 0) {
      addToCart(item.id, 1)
    }
  }

  return (
    <section className="featured-section" aria-labelledby="featured-title">
      <div className="featured-header">
        <div className="featured-title-wrap">
          <h2 id="featured-title" className="featured-title">
            Piezas destacadas
          </h2>
          <span className="featured-count">{products.length} seleccionadas</span>
        </div>

        {/* Botones accesibles de 48px para navegación anterior y siguiente */}
        <div className="carousel-controls" aria-label="Controles del carrusel de destacados">
          <button
            type="button"
            className="carousel-nav-btn"
            onClick={scrollPrev}
            aria-label="Pieza destacada anterior"
            title="Anterior"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="carousel-nav-btn"
            onClick={scrollNext}
            aria-label="Pieza destacada siguiente"
            title="Siguiente"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="featured-carousel-scroll"
        ref={carouselRef}
        tabIndex="0"
        role="region"
        aria-label="Lista de piezas destacadas con desplazamiento táctil"
      >
        {products.map((item) => {
          const price = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }).format(item.price)

          const isOutOfStock = item.stock === 0

          return (
            <Link
              key={item.id}
              to={`/producto/${item.id}`}
              className="featured-carousel-card"
              aria-label={`Ver destacada: ${item.name}`}
            >
              <div className="featured-card-img-wrap">
                <ProductImage
                  src={item.image_url}
                  alt={`Fotografía destacada de ${item.name}`}
                  className="featured-card-img"
                />
                <span className="featured-badge">Destacado</span>
              </div>
              <div className="featured-card-body">
                {/* Nombre limitado a 2 líneas */}
                <h3 className="featured-card-name" title={item.name}>
                  {item.name}
                </h3>
                {/* Misma información que la grilla: precio, material y botón agregar */}
                <div className="featured-card-footer">
                  <div className="featured-card-price-row">
                    <span className="featured-card-price">{price}</span>
                    {item.material && (
                      <span className="featured-card-material">{item.material}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="product-card-add-btn"
                    onClick={(e) => handleAddFeatured(e, item)}
                    disabled={isOutOfStock}
                    aria-label={`Agregar ${item.name} al carrito`}
                    title={isOutOfStock ? 'Sin stock' : `Agregar ${item.name} al carrito`}
                  >
                    <svg
                      width="18"
                      height="18"
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
            </Link>
          )
        })}
      </div>
    </section>
  )
}
