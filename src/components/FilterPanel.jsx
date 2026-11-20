import React from 'react'

export function FilterPanel({
  isOpen,
  materials = [],
  selectedMaterial,
  onSelectMaterial,
  priceOrder,
  onSelectPriceOrder,
  maxPrice,
  onChangeMaxPrice,
  onApply,
  onClear,
}) {
  if (!isOpen) return null

  return (
    <div className="filter-panel" role="region" aria-label="Filtros del catálogo">
      <div className="filter-panel-section">
        <h4 className="filter-panel-subtitle">Material</h4>
        <div className="filter-chips-group">
          <button
            type="button"
            className={`filter-chip-option ${!selectedMaterial ? 'active' : ''}`}
            onClick={() => onSelectMaterial('')}
          >
            Todos
          </button>
          {materials.map((m) => (
            <button
              type="button"
              key={m}
              className={`filter-chip-option ${selectedMaterial === m ? 'active' : ''}`}
              onClick={() => onSelectMaterial(selectedMaterial === m ? '' : m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel-section">
        <h4 className="filter-panel-subtitle">Ordenar por</h4>
        <div className="filter-chips-group">
          <button
            type="button"
            className={`filter-chip-option ${!priceOrder ? 'active' : ''}`}
            onClick={() => onSelectPriceOrder('')}
          >
            Relevancia
          </button>
          <button
            type="button"
            className={`filter-chip-option ${priceOrder === 'menor' ? 'active' : ''}`}
            onClick={() => onSelectPriceOrder('menor')}
          >
            Menor precio
          </button>
          <button
            type="button"
            className={`filter-chip-option ${priceOrder === 'mayor' ? 'active' : ''}`}
            onClick={() => onSelectPriceOrder('mayor')}
          >
            Mayor precio
          </button>
          <button
            type="button"
            className={`filter-chip-option ${priceOrder === 'novedades' ? 'active' : ''}`}
            onClick={() => onSelectPriceOrder('novedades')}
          >
            Novedades
          </button>
        </div>
      </div>

      <div className="filter-panel-section">
        <div className="filter-price-header">
          <h4 className="filter-panel-subtitle">Tope de precio</h4>
          <span className="filter-price-display">
            {maxPrice ? `$${Number(maxPrice).toLocaleString('es-AR')}` : 'Sin tope'}
          </span>
        </div>
        <div className="filter-price-slider-row">
          <input
            type="range"
            min="5000"
            max="35000"
            step="1000"
            value={maxPrice || 35000}
            onChange={(e) => onChangeMaxPrice(e.target.value === '35000' ? '' : e.target.value)}
            className="filter-range-slider"
            aria-label="Seleccionar precio máximo"
          />
          <div className="filter-price-ticks">
            <span>$5.000</span>
            <span>$20.000</span>
            <span>$35.000+</span>
          </div>
        </div>
      </div>

      <div className="filter-panel-actions">
        <button
          type="button"
          className="btn btn-primary filter-action-btn"
          onClick={onApply}
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          className="btn btn-outline filter-action-btn"
          onClick={onClear}
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
