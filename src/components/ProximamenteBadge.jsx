import React from 'react'

export function ProximamenteBadge({ className = '' }) {
  return (
    <span
      className={`proximamente-badge ${className}`}
      aria-disabled="true"
    >
      Próximamente
    </span>
  )
}
