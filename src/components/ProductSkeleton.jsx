import React from 'react'

export function ProductSkeleton({ count = 4 }) {
  const items = Array.from({ length: count }, (_, i) => i)

  return (
    <div className="product-grid skeleton-grid" aria-busy="true" aria-label="Cargando productos...">
      {items.map((key) => (
        <div key={key} className="product-card skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-price" />
          </div>
        </div>
      ))}
    </div>
  )
}
