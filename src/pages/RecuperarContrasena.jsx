import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RecuperarContrasena() {
  const { sendPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function validate() {
    setErrorEmail('')
    setErrorGeneral('')
    if (!email.trim()) {
      setErrorEmail('Ingresá tu email.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorEmail('El formato del email no es válido.')
      return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await sendPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('email')) {
        setErrorEmail(msg)
      } else {
        setErrorGeneral(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  // Estado: email enviado
  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-success-card" role="status" aria-live="polite">
          <div className="auth-success-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="auth-title">Revisá tu correo</h1>
          <p className="auth-success-msg">
            Te enviamos un enlace a <strong>{email}</strong> para restablecer tu contraseña.
            Revisá también la carpeta de spam.
          </p>
          <Link to="/login" className="btn-primary auth-submit-btn" style={{ textAlign: 'center', display: 'block' }}>
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h6" />
        </svg>
        <span>MADERAS</span>
      </div>

      <h1 className="auth-title">Recuperá tu contraseña</h1>
      <p className="auth-subtitle">
        Ingresá tu email y te enviamos un enlace para crear una nueva contraseña.
      </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="recover-email" className="auth-label">Email</label>
          <input
            id="recover-email"
            type="email"
            className={`auth-input ${errorEmail ? 'auth-input--error' : ''}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorEmail('') }}
            autoComplete="email"
            inputMode="email"
            aria-describedby={errorEmail ? 'recover-email-error' : undefined}
            aria-invalid={!!errorEmail}
            disabled={loading}
          />
          {errorEmail && (
            <div id="recover-email-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorEmail}</span>
            </div>
          )}
        </div>

        {errorGeneral && (
          <div className="auth-field-error auth-error-general" role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorGeneral}</span>
          </div>
        )}

        <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar enlace'}
        </button>

        <p className="auth-alt-link">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </form>
    </div>
  )
}
