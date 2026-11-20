import React from 'react'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function PerfilNotificaciones() {
  return (
    <div style={{ padding: 'var(--space-2) 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <h1 style={{ marginBottom: 0 }}>Notificaciones</h1>
        <ProximamenteBadge />
      </div>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Configurá tus canales preferidos para recibir novedades y avisos de tus pedidos.
      </p>
    </div>
  )
}
