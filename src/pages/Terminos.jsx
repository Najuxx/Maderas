import React from 'react'
import terminosData from '../content/terminos.json'

export function Terminos() {
  return (
    <div className="page-section terminos-page">
      <div className="terminos-container">
        <h1 className="page-title">{terminosData.titulo}</h1>
        <p className="terminos-updated">{terminosData.actualizacion}</p>

        <div className="terminos-aviso" role="note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{terminosData.aviso}</span>
        </div>

        <div className="terminos-secciones">
          {terminosData.secciones.map((sec, i) => (
            <section key={i} className="terminos-seccion">
              <h2 className="terminos-seccion-titulo">{sec.titulo}</h2>
              {sec.parrafos.map((p, j) => (
                <p key={j} className="terminos-parrafo">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
