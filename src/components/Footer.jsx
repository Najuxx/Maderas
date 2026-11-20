import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5491123456789'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, me comunico desde el catálogo MADERAS.')}`

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/img/logo.webp"
              alt="Logo MADERAS"
              className="footer-logo-img"
              width="160"
              height="80"
            />
          </div>
          <p className="footer-desc">
            Catálogo móvil de piezas de madera artesanales. Hechas a mano con maderas nobles y diseño consciente.
          </p>
        </div>

        <nav className="footer-links" aria-label="Enlaces de pie de página">
          <Link to="/faq" className="footer-link">Preguntas frecuentes</Link>
          <Link to="/terminos" className="footer-link">Términos y condiciones</Link>
          <Link to="/diseno" className="footer-link">Detrás del diseño</Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link footer-link--whatsapp"
            aria-label="Contactar por WhatsApp (abre en pestaña nueva)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </nav>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            Sitio demostrativo · Imágenes generadas con IA con fines ilustrativos.
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} MADERAS · Hecho con dedicación y React.
          </p>
        </div>
      </div>
    </footer>
  )
}
