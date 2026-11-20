import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M7 8h10" />
              <path d="M7 12h10" />
              <path d="M7 16h6" />
            </svg>
            <span>MADERAS</span>
          </div>
          <p className="footer-desc">
            Catálogo móvil de piezas de madera artesanales. Hechas a mano con maderas nobles y diseño consciente.
          </p>
        </div>

        <nav className="footer-links" aria-label="Enlaces de pie de página">
          <Link to="/faq" className="footer-link">Preguntas frecuentes</Link>
          <Link to="/terminos" className="footer-link">Términos y condiciones</Link>
          <Link to="/diseno" className="footer-link">Detrás del diseño</Link>
        </nav>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MADERAS · Hecho con dedicación y React.</p>
        </div>
      </div>
    </footer>
  )
}
