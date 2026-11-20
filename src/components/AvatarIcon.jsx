import React from 'react'

/**
 * 8 Avatares artesanales para MADERAS (Sección 10):
 * tronco, hoja, hacha, nogal, algarrobo, pino, eucalipto, paraíso.
 * Diseñados con las formas y tokens de la paleta oficial.
 */
export const AVATAR_OPTIONS = [
  { id: 'tronco', label: 'Tronco' },
  { id: 'hoja', label: 'Hoja' },
  { id: 'hacha', label: 'Hacha' },
  { id: 'nogal', label: 'Nogal' },
  { id: 'algarrobo', label: 'Algarrobo' },
  { id: 'pino', label: 'Pino' },
  { id: 'eucalipto', label: 'Eucalipto' },
  { id: 'paraiso', label: 'Paraíso' },
]

export function AvatarIcon({ name, size = 48, className = '' }) {
  const s = size

  switch (name) {
    case 'tronco':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="32" rx="26" ry="24" fill="var(--arena)" stroke="var(--nuez)" strokeWidth="4" />
          <ellipse cx="32" cy="32" rx="18" ry="16" stroke="var(--caramelo)" strokeWidth="3" strokeDasharray="6 3" />
          <ellipse cx="32" cy="32" rx="10" ry="9" stroke="var(--nuez)" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="3" fill="var(--texto)" />
          <path d="M32 23L32 15M23 32L15 32" stroke="var(--nuez)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )

    case 'hoja':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          <path
            d="M20 44C20 44 22 28 36 20C46 14 48 16 48 16C48 16 46 26 38 34C28 44 20 44 20 44Z"
            fill="var(--canela)"
            stroke="var(--nuez)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M22 42C28 36 34 30 46 18" stroke="var(--miel)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M31 33L36 37M37 27L42 30" stroke="var(--miel)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )

    case 'hacha':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          {/* Mango de madera */}
          <path d="M22 50L42 16" stroke="var(--canela)" strokeWidth="6" strokeLinecap="round" />
          {/* Hoja metálica / filo artesanal */}
          <path
            d="M38 18L48 12C52 18 52 26 48 30L36 24Z"
            fill="var(--nuez)"
            stroke="var(--texto)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M48 14C51 19 51 24 48 28" stroke="var(--miel)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )

    case 'nogal':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          {/* Tronco */}
          <path d="M32 36V50M28 44H36" stroke="var(--nuez)" strokeWidth="5" strokeLinecap="round" />
          {/* Copa ancha de nogal */}
          <path
            d="M32 16C24 16 18 22 18 28C18 34 22 38 28 38H36C42 38 46 34 46 28C46 22 40 16 32 16Z"
            fill="var(--nuez)"
            stroke="var(--texto)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="27" r="4" fill="var(--miel)" />
        </svg>
      )

    case 'algarrobo':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          {/* Tronco curvo y ramas extendidas */}
          <path d="M32 50C32 42 26 38 22 34M32 44C34 38 40 35 44 32" stroke="var(--nuez)" strokeWidth="4.5" strokeLinecap="round" />
          {/* Copa aparasolada */}
          <ellipse cx="32" cy="24" rx="20" ry="11" fill="var(--canela)" stroke="var(--nuez)" strokeWidth="3" />
          <ellipse cx="32" cy="24" rx="12" ry="6" fill="var(--miel)" opacity="0.6" />
        </svg>
      )

    case 'pino':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          {/* Tronco */}
          <path d="M32 44V50" stroke="var(--nuez)" strokeWidth="5" strokeLinecap="round" />
          {/* Capas triangulares del pino */}
          <polygon points="32,14 42,26 22,26" fill="var(--nuez)" stroke="var(--texto)" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="32,22 45,35 19,35" fill="var(--canela)" stroke="var(--nuez)" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="32,30 48,44 16,44" fill="var(--nuez)" stroke="var(--texto)" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      )

    case 'eucalipto':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          {/* Tronco esbelto */}
          <path d="M32 16V50" stroke="var(--nuez)" strokeWidth="4" strokeLinecap="round" />
          {/* Hojas alternadas alargadas tipo hoz */}
          <path d="M32 24C38 20 44 24 42 30C36 30 32 26 32 24Z" fill="var(--canela)" stroke="var(--nuez)" strokeWidth="2" />
          <path d="M32 32C26 28 20 32 22 38C28 38 32 34 32 32Z" fill="var(--canela)" stroke="var(--nuez)" strokeWidth="2" />
          <path d="M32 40C38 36 44 40 42 46C36 46 32 42 32 40Z" fill="var(--miel)" stroke="var(--nuez)" strokeWidth="2" />
        </svg>
      )

    case 'paraiso':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          {/* Tronco */}
          <path d="M32 38V50" stroke="var(--nuez)" strokeWidth="4.5" strokeLinecap="round" />
          {/* Copa redonda frondosa de paraíso */}
          <circle cx="32" cy="26" r="14" fill="var(--canela)" stroke="var(--nuez)" strokeWidth="3" />
          <circle cx="26" cy="24" r="5" fill="var(--miel)" />
          <circle cx="37" cy="23" r="5" fill="var(--miel)" />
          <circle cx="32" cy="30" r="4" fill="var(--miel)" />
        </svg>
      )

    default:
      // Ícono de usuario general estilizado
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="var(--arena)" />
          <circle cx="32" cy="24" r="9" fill="var(--nuez)" />
          <path d="M18 48C18 40 24 36 32 36C40 36 46 40 46 48" fill="var(--nuez)" />
        </svg>
      )
  }
}
