import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

export function PerfilPuntos() {
  const { user } = useAuth()
  const [estado, setEstado] = useState({ puntos: 0, descuento_pct: 0, nivel: 3 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function cargarEstado() {
      if (!user) return
      try {
        setLoading(true)
        const { data } = await supabase.rpc('mi_estado')
        if (isMounted && data && data[0]) {
          setEstado({
            puntos: data[0].puntos ?? 0,
            descuento_pct: data[0].descuento_pct ?? 0,
            nivel: data[0].nivel ?? 3,
          })
        }
      } catch (err) {
        console.error('Error al cargar puntos:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    cargarEstado()
    return () => {
      isMounted = false
    }
  }, [user])

  const puntosParaProximoPaso = 1000 - (estado.puntos % 1000)
  const progresoPct = ((estado.puntos % 1000) / 1000) * 100

  return (
    <div className="page-section perfil-puntos-page">
      <div className="perfil-back-nav">
        <Link to="/perfil" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Volver al perfil</span>
        </Link>
      </div>

      <h1 className="page-title">Puntos y nivel</h1>
      <p className="page-subtitle">
        Acumulá puntos con cada pedido y desbloqueá descuentos directos en tus compras.
      </p>

      {/* Tarjeta de Nivel y Puntos (puntos.png) */}
      <div className="puntos-card-main">
        <div className="puntos-level-row">
          <span className="puntos-level-text">Nivel {estado.nivel}</span>
          <div className="puntos-stars" aria-label={`Nivel ${estado.nivel} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={star <= estado.nivel ? 'var(--canela)' : 'none'}
                stroke="var(--canela)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>

        <div className="puntos-balance-row">
          <div className="puntos-balance-col">
            <span className="puntos-number">{estado.puntos.toLocaleString('es-AR')}</span>
            <span className="puntos-label">puntos acumulados</span>
          </div>
          <div className="puntos-discount-col">
            <span className="puntos-discount-pct">{estado.descuento_pct}%</span>
            <span className="puntos-discount-label">descuento activo</span>
          </div>
        </div>

        {/* Progreso hacia el próximo escalón */}
        <div className="puntos-progress-wrap">
          <div className="puntos-progress-header">
            <span>Progreso hacia +5% de descuento</span>
            <span>{puntosParaProximoPaso} pts faltantes</span>
          </div>
          <div
            className="puntos-progress-bar"
            role="progressbar"
            aria-valuenow={Math.round(progresoPct)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Progreso hacia el próximo descuento"
          >
            <div className="puntos-progress-fill" style={{ width: `${Math.min(100, Math.max(5, progresoPct))}%` }} />
          </div>
        </div>
      </div>

      {/* Reglas de Puntos y Descuentos (Sección 7) */}
      <div className="puntos-rules-card">
        <h2 className="puntos-rules-title">¿Cómo funciona el programa?</h2>
        <ul className="puntos-rules-list">
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span><strong>Bienvenida:</strong> Tu cuenta comenzó con 500 puntos de regalo y nivel 3.</span>
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span><strong>Sumás con cada compra:</strong> Por cada $5.000 abonados en un pedido sumás 500 puntos.</span>
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span><strong>Descuentos directos:</strong> Cada 1.000 puntos acumulados te dan 5% de descuento automático (hasta un tope de 20%).</span>
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span><strong>Los puntos no se gastan:</strong> Se acumulan para mantener e incrementar tu porcentaje de descuento.</span>
          </li>
        </ul>
      </div>

      {/* Canje de puntos (Próximamente según sección 12) */}
      <div className="puntos-canje-card">
        <div className="puntos-canje-left">
          <div className="puntos-canje-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>
          <div>
            <h3 className="puntos-canje-title">Canje por piezas y regalos</h3>
            <p className="puntos-canje-desc">Pronto vas a poder canjear puntos acumulados por piezas seleccionadas del taller.</p>
          </div>
        </div>
        <ProximamenteBadge />
      </div>
    </div>
  )
}
