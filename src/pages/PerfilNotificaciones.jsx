import React from 'react'
import { Link } from 'react-router-dom'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function PerfilNotificaciones() {
  return (
    <div className="page-section perfil-notif-page">
      <div className="perfil-back-nav">
        <Link to="/perfil" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Volver al perfil</span>
        </Link>
      </div>

      <div className="perfil-notif-header">
        <div className="notif-title-row">
          <h1 className="page-title" style={{ margin: 0 }}>Notificaciones</h1>
          <ProximamenteBadge />
        </div>
        <p className="page-subtitle" style={{ marginTop: 'var(--space-2)' }}>
          Configurá los avisos y alertas que deseás recibir en tu cuenta.
        </p>
      </div>

      <div className="notif-card">
        <div className="notif-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h2 className="notif-card-title">Canales de comunicación en camino</h2>
        <p className="notif-card-desc">
          Estamos integrando el envío de novedades por WhatsApp y correo electrónico para avisarte sobre promociones de maderas nobles y el seguimiento en tiempo real de tus pedidos.
        </p>

        <div className="notif-options-preview" aria-hidden="true">
          <div className="notif-option-mock">
            <span>Avisos de pedidos por WhatsApp</span>
            <span className="notif-mock-switch"></span>
          </div>
          <div className="notif-option-mock">
            <span>Promociones y nuevas piezas de autor</span>
            <span className="notif-mock-switch"></span>
          </div>
        </div>

        <Link to="/perfil" className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>
          Volver a mi perfil
        </Link>
      </div>
    </div>
  )
}
