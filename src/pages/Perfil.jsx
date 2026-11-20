import React from 'react'
import { Link } from 'react-router-dom'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function Perfil() {
  return (
    <div style={{ padding: 'var(--space-2) 0' }}>
      <h1>Mi perfil</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Gestioná tus datos personales, consultá tus puntos y revisá tus pedidos.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        <Link to="/perfil/puntos" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
          Puntos y nivel
        </Link>
        <Link to="/perfil/editar" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
          Editar perfil
        </Link>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Mis pedidos</span>
          <ProximamenteBadge />
        </div>
      </div>
    </div>
  )
}
