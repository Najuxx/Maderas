import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/ProductSkeleton'

export function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, materials, featuredProducts, loading, error, refetch } = useProducts()

  // Sincronización inicial desde la URL
  const urlCategory = searchParams.get('categoria') || 'Todos'
  const urlQuery = searchParams.get('q') || ''
  const urlMaterial = searchParams.get('material') || ''
  const urlOrden = searchParams.get('orden') || ''
  const urlMaxPrice = searchParams.get('maxPrecio') || ''
  const urlFiltrosOpen = searchParams.get('filtros') === '1'

  // Estados locales de filtros
  const [searchTerm, setSearchTerm] = useState(urlQuery)
  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [selectedMaterial, setSelectedMaterial] = useState(urlMaterial)
  const [priceOrder, setPriceOrder] = useState(urlOrden)
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice)
  const [isFilterOpen, setIsFilterOpen] = useState(urlFiltrosOpen)

  // Sincronizar estado local si cambia la URL por navegación del historial
  useEffect(() => {
    setSelectedCategory(searchParams.get('categoria') || 'Todos')
    setSearchTerm(searchParams.get('q') || '')
    setSelectedMaterial(searchParams.get('material') || '')
    setPriceOrder(searchParams.get('orden') || '')
    setMaxPrice(searchParams.get('maxPrecio') || '')
    if (searchParams.get('filtros') === '1') {
      setIsFilterOpen(true)
    }
  }, [searchParams])

  // Función para actualizar los parámetros en la URL
  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams)

    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === 'Todos') {
        updated.delete(key)
      } else {
        updated.set(key, val)
      }
    })

    setSearchParams(updated, { replace: true })
  }

  // Manejar cambio de categoría
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    updateUrlParams({ categoria: cat })
  }

  // Manejar submit del buscador
  const handleSearchSubmit = (term) => {
    setSearchTerm(term)
    updateUrlParams({ q: term })
  }

  // Aplicar filtros del panel
  const handleApplyFilters = () => {
    updateUrlParams({
      material: selectedMaterial,
      orden: priceOrder,
      maxPrecio: maxPrice,
      filtros: '', // cerramos el indicador de abrir panel
    })
    setIsFilterOpen(false)
  }

  // Limpiar todos los filtros secundarios
  const handleClearFilters = () => {
    setSelectedMaterial('')
    setPriceOrder('')
    setMaxPrice('')
    updateUrlParams({
      material: '',
      orden: '',
      maxPrecio: '',
      filtros: '',
    })
  }

  // Limpiar un filtro individual activo
  const removeFilter = (filterType) => {
    if (filterType === 'categoria') {
      setSelectedCategory('Todos')
      updateUrlParams({ categoria: 'Todos' })
    } else if (filterType === 'q') {
      setSearchTerm('')
      updateUrlParams({ q: '' })
    } else if (filterType === 'material') {
      setSelectedMaterial('')
      updateUrlParams({ material: '' })
    } else if (filterType === 'orden') {
      setPriceOrder('')
      updateUrlParams({ orden: '' })
    } else if (filterType === 'maxPrecio') {
      setMaxPrice('')
      updateUrlParams({ maxPrecio: '' })
    }
  }

  const hasActiveSecondaryFilters = Boolean(selectedMaterial || priceOrder || maxPrice)

  // Filtrado y ordenamiento de productos
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // 1. Filtrar por Categoría
    if (selectedCategory && selectedCategory !== 'Todos') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // 2. Búsqueda por texto (nombre, descripción y material)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.material && p.material.toLowerCase().includes(q))
      )
    }

    // 3. Filtrar por Material
    if (selectedMaterial) {
      result = result.filter((p) => p.material === selectedMaterial)
    }

    // 4. Filtrar por Precio máximo
    if (maxPrice) {
      const limit = Number(maxPrice)
      result = result.filter((p) => Number(p.price) <= limit)
    }

    // 5. Ordenamiento
    if (priceOrder === 'menor') {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (priceOrder === 'mayor') {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (priceOrder === 'novedades') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    return result
  }, [products, selectedCategory, searchTerm, selectedMaterial, maxPrice, priceOrder])

  // Lista de chips de filtros activos para mostrar con botón X
  const activeChips = []
  if (selectedCategory && selectedCategory !== 'Todos') {
    activeChips.push({ type: 'categoria', label: selectedCategory })
  }
  if (searchTerm.trim()) {
    activeChips.push({ type: 'q', label: `"${searchTerm.trim()}"` })
  }
  if (selectedMaterial) {
    activeChips.push({ type: 'material', label: selectedMaterial })
  }
  if (maxPrice) {
    activeChips.push({ type: 'maxPrecio', label: `Hasta $${Number(maxPrice).toLocaleString('es-AR')}` })
  }
  if (priceOrder) {
    const orderLabels = {
      menor: 'Menor precio',
      mayor: 'Mayor precio',
      novedades: 'Novedades',
    }
    activeChips.push({ type: 'orden', label: orderLabels[priceOrder] || priceOrder })
  }

  return (
    <div className="catalogo-page">
      {/* Chips de categorías en la parte superior (catalogo-0.png a catalogo-3.png) */}
      <section className="categories-section" aria-label="Filtrar por categoría">
        <div className="categories-chips-scroll" role="tablist">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Buscador con botón de filtro */}
      <section className="catalogo-search-section">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSearchSubmit}
          isFilterOpen={isFilterOpen}
          onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
          hasActiveFilters={hasActiveSecondaryFilters}
          placeholder="Buscar por nombre, descripción o madera..."
        />
      </section>

      {/* Panel desplegable de filtros (filtros.png) */}
      <FilterPanel
        isOpen={isFilterOpen}
        materials={materials}
        selectedMaterial={selectedMaterial}
        onSelectMaterial={setSelectedMaterial}
        priceOrder={priceOrder}
        onSelectPriceOrder={setPriceOrder}
        maxPrice={maxPrice}
        onChangeMaxPrice={setMaxPrice}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Chips de filtros activos con botón X (filtros-quitando.png) */}
      {activeChips.length > 0 && (
        <section className="active-filters-bar" aria-label="Filtros aplicados">
          <div className="active-filters-scroll">
            {activeChips.map((chip) => (
              <span key={chip.type} className="active-filter-chip">
                <span>{chip.label}</span>
                <button
                  type="button"
                  className="active-filter-remove-btn"
                  onClick={() => removeFilter(chip.type)}
                  aria-label={`Quitar filtro ${chip.label}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              className="active-filters-clear-all"
              onClick={() => {
                handleCategoryChange('Todos')
                handleSearchSubmit('')
                handleClearFilters()
              }}
            >
              Limpiar todo
            </button>
          </div>
        </section>
      )}

      {/* Estado de carga con Skeleton */}
      {loading && <ProductSkeleton count={8} />}

      {/* Estado de error con botón Reintentar */}
      {error && !loading && (
        <div className="state-card state-error" role="alert">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>No pudimos cargar el catálogo</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {/* Grilla de productos o Estado Sin Resultados (filtros-sin-resultados.png) */}
      {!loading && !error && (
        <>
          {filteredProducts.length > 0 ? (
            <section className="products-grid-section" aria-label="Listado de productos">
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ) : (
            <div className="no-results-container">
              <div className="no-results-icon" aria-hidden="true">🪵</div>
              <h2 className="no-results-title">No hay resultados para tu búsqueda</h2>
              <p className="no-results-desc">
                Probá usando términos más generales o quitando algunos de los filtros seleccionados.
              </p>

              {/* Recomendados: "Productos que podrían interesarte" (filtros-sin-resultados.png) */}
              <section className="recommended-section" aria-labelledby="recommended-title">
                <h3 id="recommended-title" className="recommended-title">
                  Productos que podrían interesarte:
                </h3>
                <div className="product-grid">
                  {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  )
}
