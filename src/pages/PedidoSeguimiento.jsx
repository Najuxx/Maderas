import React from 'react'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function PedidoSeguimiento() {
  return (
    <div style={{ padding: 'var(--space-2) 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <h1 style={{ marginBottom: 0 }}>Seguimiento de pedido</h1>
        <ProximamenteBadge />
      </div>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Seguí el estado de preparación y envío de tus piezas artesanales en tiempo real.
      </p>
    </div>
  )
}
