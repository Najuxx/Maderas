import React from 'react'
import { Link } from 'react-router-dom'

export function NotFound() {
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
      <div style={{ fontSize: '3.5rem' }}>🪵</div>
      <h1 style={{ fontSize: '2rem', marginBottom: 0 }}>404</h1>
      <h2>Página no encontrada</h2>
      <p style={{ maxWidth: '340px', color: 'var(--color-text-muted)' }}>
        No pudimos encontrar la pantalla que buscás. Es posible que haya cambiado de lugar o no exista.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
        Ir al inicio
      </Link>
    </div>
  )
}
