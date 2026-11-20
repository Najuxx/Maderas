import React from 'react'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function PerfilPuntos() {
  return (
    <div style={{ padding: 'var(--space-2) 0' }}>
      <h1>Mis puntos</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Consultá tu nivel, puntos acumulados y descuento vigente para tus compras.
      </p>
      <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span>Canje de puntos por productos:</span>
        <ProximamenteBadge />
      </div>
    </div>
  )
}
