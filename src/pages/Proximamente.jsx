import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function Proximamente() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-4)',
        gap: 'var(--space-4)',
        minHeight: '60vh',
      }}
    >
      <div style={{ fontSize: '3rem' }}>🔨</div>
      
      <ProximamenteBadge />

      <h1>Próximamente</h1>

      <p style={{ maxWidth: '360px', color: 'var(--color-text-muted)', fontSize: '1.0625rem' }}>
        Estamos trabajando en esto. ¡Pronto vas a poder usarlo!
      </p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate(-1)}
        style={{ marginTop: 'var(--space-4)' }}
      >
        Volver
      </button>
    </div>
  )
}
