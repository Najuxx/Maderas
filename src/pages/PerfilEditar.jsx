import React from 'react'
import { Link } from 'react-router-dom'

export function PerfilEditar() {
  return (
    <div style={{ padding: 'var(--space-2) 0' }}>
      <h1>Editar perfil</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Elegí la información que deseás actualizar en tu cuenta.
      </p>
      <div style={{ marginTop: 'var(--space-3)' }}>
        <Link to="/perfil/datos" className="btn btn-secondary">
          Editar datos y personalización
        </Link>
      </div>
    </div>
  )
}
