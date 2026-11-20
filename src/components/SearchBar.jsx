import React, { useState, useEffect, useRef } from 'react'

const RECENT_KEY = 'maderas_recent_searches'

export function SearchBar({
  value,
  onChange,
  onSubmit,
  isFilterOpen,
  onToggleFilter,
  hasActiveFilters = false,
  placeholder = 'Buscar piezas...',
}) {
  const [recentSearches, setRecentSearches] = useState([])
  const [showRecent, setShowRecent] = useState(false)
  const containerRef = useRef(null)

  // Cargar búsquedas recientes desde localStorage (máx 5) con try/catch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY)
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      }
    } catch (err) {
      console.warn('Error al leer búsquedas recientes:', err)
    }
  }, [])

  // Guardar una búsqueda reciente
  const saveRecentSearch = (term) => {
    const clean = term.trim()
    if (!clean) return
    try {
      const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    } catch (err) {
      console.warn('Error al guardar búsqueda reciente:', err)
    }
  }

  // Eliminar una búsqueda reciente individual con su botón X
  const removeRecentSearch = (termToRemove, e) => {
    e.stopPropagation()
    try {
      const updated = recentSearches.filter((s) => s !== termToRemove)
      setRecentSearches(updated)
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    } catch (err) {
      console.warn('Error al eliminar búsqueda reciente:', err)
    }
  }

  // Cerrar lista desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowRecent(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveRecentSearch(value)
      setShowRecent(false)
      if (onSubmit) onSubmit(value)
    }
  }

  const handleSelectRecent = (term) => {
    onChange(term)
    saveRecentSearch(term)
    setShowRecent(false)
    if (onSubmit) onSubmit(term)
  }

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div className="search-bar">
        <span className="search-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowRecent(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Buscar en el catálogo"
        />

        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              onChange('')
              if (onSubmit) onSubmit('')
            }}
            aria-label="Limpiar texto de búsqueda"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className={`search-filter-btn ${isFilterOpen ? 'open' : ''} ${hasActiveFilters ? 'has-active' : ''}`}
          onClick={onToggleFilter}
          aria-label={isFilterOpen ? 'Ocultar panel de filtros' : 'Mostrar panel de filtros'}
          aria-expanded={isFilterOpen}
          title="Filtros"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          {hasActiveFilters && <span className="filter-active-dot" aria-hidden="true" />}
        </button>
      </div>

      {/* Desplegable de búsquedas recientes (catalogo-busquedas-recientes.png) */}
      {showRecent && recentSearches.length > 0 && (
        <div className="recent-searches-dropdown" role="region" aria-label="Búsquedas recientes">
          <div className="recent-searches-header">
            <span>Búsquedas recientes</span>
          </div>
          <ul className="recent-searches-list">
            {recentSearches.map((term) => (
              <li key={term} className="recent-search-item">
                <button
                  type="button"
                  className="recent-search-term-btn"
                  onClick={() => handleSelectRecent(term)}
                  aria-label={`Buscar de nuevo: ${term}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{term}</span>
                </button>
                <button
                  type="button"
                  className="recent-search-remove-btn"
                  onClick={(e) => removeRecentSearch(term, e)}
                  aria-label={`Eliminar ${term} de búsquedas recientes`}
                  title="Eliminar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
