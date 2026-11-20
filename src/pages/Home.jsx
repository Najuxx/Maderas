import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { SearchBar } from '../components/SearchBar'
import { FeaturedCarousel } from '../components/FeaturedCarousel'
import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/ProductSkeleton'

export function Home() {
  const navigate = useNavigate()
  const { products, categories, featuredProducts, loading, error, refetch } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (term) => {
    if (term.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(term.trim())}`)
    } else {
      navigate('/catalogo')
    }
  }

  const handleToggleFilter = () => {
    navigate('/catalogo?filtros=1')
  }

  // Filtrado rápido por categoría en el Home
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'Todos') return true
    return p.category === selectedCategory
  })

  return (
    <div className="home-page">
      {/* Buscador con ícono de filtro y búsquedas recientes */}
      <section className="home-search-section">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSearchSubmit}
          isFilterOpen={false}
          onToggleFilter={handleToggleFilter}
          placeholder="Buscar piezas de madera..."
        />
      </section>

      {/* Título principal de la tienda (según home.png) */}
      <header className="home-header">
        <h1 className="home-title">Parte de nuestras bonitas piezas de madera</h1>
      </header>

      {/* Estado de carga con Skeleton */}
      {loading && (
        <div>
          <div className="skeleton-featured" aria-hidden="true" />
          <ProductSkeleton count={6} />
        </div>
      )}

      {/* Estado de error con botón Reintentar */}
      {error && !loading && (
        <div className="state-card state-error" role="alert">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>No pudimos cargar los productos</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Carrusel de destacados (featured = true) */}
          {featuredProducts.length > 0 && (
            <FeaturedCarousel products={featuredProducts} />
          )}

          {/* Chips de categorías */}
          <section className="categories-section" aria-label="Categorías de productos">
            <div className="categories-chips-scroll" role="tablist">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Grilla de productos */}
          <section className="products-grid-section" aria-label="Catálogo de productos">
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
