import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guardián de rutas privadas (Sección 6 & 7).
 * Si el usuario no tiene sesión iniciada, muestra la pantalla "Necesitás una cuenta"
 * con botones accesibles para Iniciar sesión o Crear cuenta.
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page-section protected-loading" aria-busy="true" aria-live="polite">
        <div className="skeleton-line" style={{ width: '40%', height: '28px', marginBottom: 'var(--space-3)' }} />
        <div className="skeleton-line" style={{ width: '70%', height: '16px' }} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-section protected-empty-state" role="region" aria-labelledby="protected-title">
        <div className="protected-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1 id="protected-title" className="page-title" style={{ marginTop: 'var(--space-2)' }}>
          Necesitás una cuenta
        </h1>

        <p className="protected-desc">
          Para acceder a tu perfil, personalizar tus datos, consultar tus puntos y recibir descuentos en tus compras, iniciá sesión o creá tu cuenta gratuita.
        </p>

        <div className="protected-actions">
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="btn btn-primary protected-btn"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/registro"
            className="btn btn-secondary protected-btn"
          >
            Crear cuenta
          </Link>

          <Link
            to="/"
            className="protected-back-link"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return children
}
