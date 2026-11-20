import React, { useState } from 'react'

export function ProductImage({ src, alt, className = '' }) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Si no hay src o si falló la carga, mostramos el placeholder elegante con colores de la paleta
  if (!src || hasError) {
    return (
      <div
        className={`product-image-fallback ${className}`}
        role="img"
        aria-label={alt || 'Pieza artesanal de madera'}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="product-fallback-icon"
          aria-hidden="true"
        >
          {/* Ícono estilizado de pieza torneada / corteza de madera */}
          <rect x="6" y="8" width="36" height="32" rx="6" />
          <path d="M12 16h24" />
          <path d="M12 24h24" />
          <path d="M12 32h16" />
          <circle cx="34" cy="32" r="2" fill="currentColor" />
        </svg>
        <span className="product-fallback-label">MADERAS</span>
      </div>
    )
  }

  return (
    <div className={`product-image-container ${className}`}>
      {!isLoaded && <div className="product-image-skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt || 'Producto artesanal de madera'}
        className={`product-img ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  )
}
