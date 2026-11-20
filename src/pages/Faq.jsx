import React, { useState } from 'react'
import faqData from '../content/faq.json'

export function Faq() {
  // Soporte para que pueda haber varias preguntas abiertas simultáneamente
  const [openIndexes, setOpenIndexes] = useState([0])

  function toggle(i) {
    setOpenIndexes((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    )
  }

  return (
    <div className="page-section faq-page">
      <h1 className="page-title">{faqData.titulo}</h1>

      <div className="faq-list" role="list">
        {faqData.preguntas.map((item, i) => {
          const isOpen = openIndexes.includes(i)
          const headingId = `faq-q-${i}`
          const panelId = `faq-a-${i}`

          return (
            <div key={i} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} role="listitem">
              <button
                type="button"
                id={headingId}
                className="faq-question"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span>{item.pregunta}</span>
                <svg
                  className="faq-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                className="faq-answer"
                hidden={!isOpen}
              >
                <p>{item.respuesta}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
