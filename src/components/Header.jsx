import React from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAccessibility } from '../context/AccessibilityContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { prefs, togglePreference } = useAccessibility()
  const { totalCount } = useCart()
  const { user } = useAuth()
  const isDark = prefs.theme === 'dark'

  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <div className="header-left">
          {isHome ? (
            <Link to="/" className="header-brand-link" aria-label="MADERAS - Inicio">
              <div className="header-logo-icon">
                <img
                  src="/img/logo-isotipo.webp"
                  alt="Isotipo artesanal M de MADERAS"
                  className="header-logo-img"
                  width="38"
                  height="24"
                />
              </div>
              <span className="header-brand-name">MADERAS</span>
            </Link>
          ) : (
            <button
              type="button"
              className="header-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Volver a la pantalla anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="header-center">
          {!isHome && (
            <Link to="/" className="header-brand-link header-brand-internal" aria-label="MADERAS - Ir a inicio">
              <div className="header-logo-icon">
                <img
                  src="/img/logo-isotipo.webp"
                  alt="Isotipo artesanal M de MADERAS"
                  className="header-logo-img"
                  width="38"
                  height="24"
                />
              </div>
              <span className="header-brand-name">MADERAS</span>
            </Link>
          )}

          {/* Navegación horizontal para escritorio (>= 900 px) */}
          <nav className="header-desktop-nav" aria-label="Navegación principal de escritorio">
            <NavLink
              to="/"
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Inicio
            </NavLink>
            <NavLink
              to="/catalogo"
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
            >
              Catálogo
            </NavLink>
            <NavLink
              to="/carrito"
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
            >
              Carrito {totalCount > 0 && `(${totalCount})`}
            </NavLink>
          </nav>
        </div>

        <div className="header-right">
          {/* Botón de tema (sol/luna) de 48px sincronizado con el panel */}
          <button
            type="button"
            className="header-icon-btn theme-toggle-btn"
            onClick={() => togglePreference('theme')}
            aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            title={isDark ? 'Tema claro' : 'Tema oscuro'}
          >
            {isDark ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <Link
            to="/carrito"
            className="header-icon-btn"
            aria-label={`Carrito de compras, ${totalCount} productos`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalCount > 0 && <span className="header-badge">{totalCount}</span>}
          </Link>

          <Link
            to={user ? '/perfil' : '/login'}
            className="header-icon-btn"
            aria-label={user ? 'Mi perfil' : 'Iniciar sesión'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
