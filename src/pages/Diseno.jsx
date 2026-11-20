import React, { useState, useEffect } from 'react'

/**
 * Categorización de wireframes por flujo de usuario (Sección 6 & 14 de DESIGN.md).
 */
const WIREFRAME_FLOWS = {
  explorar: {
    title: 'Explorar',
    items: [
      { file: 'home.webp', name: 'Inicio (Home)', desc: 'Buscador, carrusel de destacados y grilla de productos' },
      { file: 'catalogo-0.webp', name: 'Catálogo (General)', desc: 'Vista principal con chips de categorías' },
      { file: 'catalogo-1.webp', name: 'Catálogo (Tablas)', desc: 'Filtrado por categoría tablas de picar' },
      { file: 'catalogo-2.webp', name: 'Catálogo (Bowls)', desc: 'Filtrado por categoría bowls y cuencos' },
      { file: 'catalogo-3.webp', name: 'Catálogo (Mobiliario)', desc: 'Filtrado por mobiliario y percheros' },
      { file: 'catalogo-busquedas-recientes.webp', name: 'Búsquedas recientes', desc: 'Historial en localStorage con botón de eliminar' },
      { file: 'filtros.webp', name: 'Panel de filtros', desc: 'Filtros por categoría, material noble y precio' },
      { file: 'filtros-quitando.webp', name: 'Filtros aplicados', desc: 'Remoción de chips activos de filtro' },
      { file: 'filtros-sin-resultados.webp', name: 'Sin resultados', desc: 'Mensaje con sugerencias de piezas recomendadas' },
      { file: 'producto.webp', name: 'Detalle de producto', desc: 'Foto, precio, agregar al carrito y piezas relacionadas' },
      { file: 'producto-zoom.webp', name: 'Zoom de producto', desc: 'Vista ampliada a pantalla completa con botón de cierre' },
      { file: 'favoritos.webp', name: 'Favoritos', desc: 'Lista de piezas guardadas con agregar al carrito' },
      { file: 'favoritos-vacio.webp', name: 'Favoritos vacío', desc: 'Estado vacío con botón de regreso al catálogo' },
    ],
  },
  comprar: {
    title: 'Comprar',
    items: [
      { file: 'carrito.webp', name: 'Carrito de compras', desc: 'Selector de cantidades, subtotal, descuento y total' },
      { file: 'carrito-vacio.webp', name: 'Carrito vacío', desc: 'Estado vacío sin totales y botón de ir al catálogo' },
      { file: 'pedido-confirmar.webp', name: 'Confirmar pedido', desc: 'Resumen de compra y cierre directo por WhatsApp' },
      { file: 'pedido-enviado.webp', name: 'Pedido enviado', desc: 'Confirmación exitosa con detalle de puntos acumulados' },
      { file: 'pedido-error.webp', name: 'Error en pedido', desc: 'Aviso claro de falla de conexión con opción de reintentar' },
      { file: 'pedido-seguimiento.webp', name: 'Seguimiento de pedido', desc: 'Visualización de estados del pedido (Próximamente)' },
    ],
  },
  cuenta: {
    title: 'Cuenta y Perfil',
    items: [
      { file: 'login.webp', name: 'Iniciar sesión', desc: 'Ingreso con email y contraseña' },
      { file: 'login-error-email.webp', name: 'Error de email', desc: 'Validación en línea de formato de correo' },
      { file: 'login-error-contrasena.webp', name: 'Error de contraseña', desc: 'Aviso accesible ante credenciales incorrectas' },
      { file: 'registro.webp', name: 'Crear cuenta', desc: 'Registro con indicador de fortaleza de contraseña' },
      { file: 'recuperar-contrasena.webp', name: 'Recuperar contraseña', desc: 'Envío de enlace de restablecimiento al correo' },
      { file: 'restablecer-contrasena.webp', name: 'Restablecer contraseña', desc: 'Creación y confirmación de nueva clave' },
      { file: 'perfil.webp', name: 'Mi perfil', desc: 'Menú principal de cuenta, nivel y accesos rápidos' },
      { file: 'perfil-editar.webp', name: 'Editar perfil', desc: 'Opciones de edición y zona de eliminación de cuenta' },
      { file: 'perfil-datos.webp', name: 'Datos personales', desc: 'Personalización de apodo, avatar y material favorito' },
      { file: 'perfil-cerrar-sesion.webp', name: 'Cerrar sesión', desc: 'Modal neutro de confirmación sin color destructivo' },
      { file: 'perfil-borrar-cuenta.webp', name: 'Borrar cuenta', desc: 'Modal con confirmación escrita de la palabra BORRAR' },
      { file: 'perfil-notificaciones.webp', name: 'Notificaciones', desc: 'Preferencias de canales de alerta (Próximamente)' },
      { file: 'puntos.webp', name: 'Puntos y beneficios', desc: 'Visualización de estrellas, nivel, saldo y descuentos' },
    ],
  },
  sistema: {
    title: 'Estados del sistema',
    items: [
      { file: 'skeleton.webp', name: 'Skeleton de carga', desc: 'Marcadores de posición durante la carga de Supabase' },
      { file: 'sin-conexion.webp', name: 'Sin conexión', desc: 'Aviso offline con ícono de wifi tachado y botón reintentar' },
    ],
  },
  accesibilidad: {
    title: 'Accesibilidad',
    items: [
      { file: 'accesibilidad-panel.webp', name: 'Panel flotante', desc: 'Control de tamaño de texto, temas, contraste y movimiento' },
    ],
  },
}

const COMPARATIVAS = [
  { id: 'home', title: 'Inicio (Home)', wireframe: 'home.webp', final: 'final-home.webp' },
  { id: 'catalogo', title: 'Catálogo', wireframe: 'catalogo-0.webp', final: 'final-catalogo.webp' },
  { id: 'producto', title: 'Detalle de producto', wireframe: 'producto.webp', final: 'final-producto.webp' },
  { id: 'carrito', title: 'Carrito de compras', wireframe: 'carrito.webp', final: 'final-carrito.webp' },
]

export function Diseno() {
  const [activeFlow, setActiveFlow] = useState('explorar')
  const [zoomImage, setZoomImage] = useState(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && zoomImage) {
        setZoomImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomImage])

  return (
    <div className="page-section diseno-page">
      <div className="diseno-header">
        <h1 className="page-title">Detrás del diseño</h1>
        <p className="page-subtitle">
          El proceso creativo y técnico que dio vida a MADERAS: desde los wireframes iniciales de baja fidelidad en Figma hasta la plataforma interactiva en React.
        </p>
      </div>

      {/* Sección a: Introducción */}
      <section className="diseno-section" aria-labelledby="diseno-intro-title">
        <h2 id="diseno-intro-title" className="diseno-section-title">1. El problema y los usuarios</h2>
        <div className="diseno-card">
          <p>
            <strong>MADERAS</strong> nace de la necesidad de acercar el trabajo de ebanistas y artesanos de la madera a usuarios que valoran piezas únicas, duraderas y de origen noble. Muchas tiendas tradicionales abruman con procesos de compra complejos o exigen registro obligatorio antes de ver un precio.
          </p>
          <p>
            Diseñamos una solución <strong>mobile-first</strong> centrada en la simpleza: un catálogo fluido, cuenta completamente opcional, guardado de favoritos y cierre de pedidos directo a través de WhatsApp, donde comprador y taller coordinan el pago y la entrega de manera transparente y humana.
          </p>
        </div>
      </section>

      {/* Sección b: Proceso de diseño */}
      <section className="diseno-section" aria-labelledby="diseno-proceso-title">
        <h2 id="diseno-proceso-title" className="diseno-section-title">2. Proceso: De baja fidelidad al código</h2>
        <div className="diseno-card">
          <p>
            El diseño comenzó en Figma definiendo una grilla móvil estándar de <strong>412 × 917 px</strong>. Los wireframes se trabajaron en baja fidelidad monocromática para concentrar las decisiones en:
          </p>
          <ul className="diseno-list">
            <li><strong>Jerarquía de información:</strong> Ubicar los puntos clave de interacción en la zona del pulgar (Bottom Navigation bar de 3 ítems y áreas táctiles de 48 × 48 px).</li>
            <li><strong>Claridad en los flujos:</strong> El carrito muestra explícitamente subtotal, porcentaje de descuento ganado y total final antes del contacto por WhatsApp.</li>
            <li><strong>Sistemas resilientes:</strong> Considerar desde el primer día estados de carga (skeletons), sin conexión y errores con botones explícitos de reintento.</li>
          </ul>
        </div>
      </section>

      {/* Sección c: Galería de wireframes por flujo */}
      <section className="diseno-section" aria-labelledby="diseno-galeria-title">
        <h2 id="diseno-galeria-title" className="diseno-section-title">3. Galería de wireframes por flujo</h2>
        <p className="diseno-section-desc">
          Explorá los 37 wireframes que documentan cada pantalla del producto. Hacé clic en cualquier imagen para verla en pantalla completa.
        </p>

        {/* Selector de flujos */}
        <div className="diseno-flow-chips" role="tablist" aria-label="Flujos de diseño">
          {Object.entries(WIREFRAME_FLOWS).map(([key, flow]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeFlow === key}
              className={`chip ${activeFlow === key ? 'chip--active' : ''}`}
              onClick={() => setActiveFlow(key)}
            >
              {flow.title} ({flow.items.length})
            </button>
          ))}
        </div>

        {/* Grilla de wireframes */}
        <div className="diseno-wireframe-grid">
          {WIREFRAME_FLOWS[activeFlow].items.map((item, idx) => (
            <div
              key={idx}
              className="wireframe-card"
              onClick={() => setZoomImage({ src: `/img/diseno/${item.file}`, alt: item.name, name: item.name, desc: item.desc })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setZoomImage({ src: `/img/diseno/${item.file}`, alt: item.name, name: item.name, desc: item.desc })
                }
              }}
              aria-label={`Ver wireframe ampliado: ${item.name}`}
            >
              <div className="wireframe-img-wrap">
                <img
                  src={`/img/diseno/${item.file}`}
                  alt={`Wireframe de ${item.name}: ${item.desc}`}
                  loading="lazy"
                  className="wireframe-img"
                />
                <span className="wireframe-zoom-badge" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
              </div>
              <div className="wireframe-meta">
                <span className="wireframe-name">{item.name}</span>
                <span className="wireframe-desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección d: Decisiones de diseño */}
      <section className="diseno-section" aria-labelledby="diseno-decisiones-title">
        <h2 id="diseno-decisiones-title" className="diseno-section-title">4. Decisiones de diseño y producto</h2>

        <div className="diseno-decisiones-grid">
          {/* Paleta y contraste */}
          <div className="diseno-card">
            <h3 className="diseno-card-title">Paleta de colores y tokens</h3>
            <p>
              Inspirada en las tonalidades orgánicas de las maderas nobles (nogal, algarrobo, paraíso, eucalipto y pino). Cada token garantiza legibilidad estricta bajo WCAG 2.2:
            </p>
            <div className="palette-table-wrap">
              <table className="palette-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Hex</th>
                    <th>Uso</th>
                    <th>Contraste</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="color-swatch" style={{ background: '#ede0d4' }}></span> --crema</td>
                    <td>#ede0d4</td>
                    <td>Fondo general</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td><span className="color-swatch" style={{ background: '#e6ccb2' }}></span> --arena</td>
                    <td>#e6ccb2</td>
                    <td>Tarjetas y superficies</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td><span className="color-swatch" style={{ background: '#ddb892' }}></span> --miel</td>
                    <td>#ddb892</td>
                    <td>Chips y badges</td>
                    <td>8.8 (oscuro)</td>
                  </tr>
                  <tr>
                    <td><span className="color-swatch" style={{ background: '#7f5539' }}></span> --nuez</td>
                    <td>#7f5539</td>
                    <td>Botón principal, títulos</td>
                    <td>4.97 (AA)</td>
                  </tr>
                  <tr>
                    <td><span className="color-swatch" style={{ background: '#9c6644' }}></span> --canela</td>
                    <td>#9c6644</td>
                    <td>Acentos y enlaces</td>
                    <td>4.78 (AA)</td>
                  </tr>
                  <tr>
                    <td><span className="color-swatch" style={{ background: '#2b1d14' }}></span> --texto</td>
                    <td>#2b1d14</td>
                    <td>Texto base principal</td>
                    <td>12.58 (AAA)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel de accesibilidad */}
          <div className="diseno-card">
            <h3 className="diseno-card-title">Panel flotante de accesibilidad</h3>
            <p>
              Integra herramientas directamente en la aplicación sin depender de extensiones del navegador:
            </p>
            <ul className="diseno-list">
              <li><strong>Tamaño de texto:</strong> selector dinámico A / A+ / A++.</li>
              <li><strong>Modo oscuro y Alto contraste:</strong> aplicados mediante atributos en `&lt;html&gt;`.</li>
              <li><strong>Pausar animaciones:</strong> respeto nativo a `prefers-reduced-motion`.</li>
              <li><strong>Subrayado de enlaces y foco resaltado:</strong> garantiza navegación por teclado sin barreras.</li>
            </ul>
          </div>

          {/* Cuenta opcional y programa de fidelización */}
          <div className="diseno-card">
            <h3 className="diseno-card-title">Cuenta opcional y puntos</h3>
            <p>
              La app no obliga a iniciar sesión. Cualquier usuario puede explorar y cerrar un pedido por WhatsApp como invitado. Al registrarse, se otorgan <strong>500 puntos de bienvenida</strong> y <strong>nivel 3</strong>, que permite personalizar el perfil (avatar artesanal, apodo y madera predilecta). Cada compra suma 500 puntos cada $5.000 abonados, otorgando 5% de descuento cada 1.000 puntos hasta un 20% de descuento.
            </p>
          </div>

          {/* Transparencia con "Próximamente" */}
          <div className="diseno-card">
            <h3 className="diseno-card-title">Estrategia "Próximamente"</h3>
            <p>
              En lugar de ocultar funciones en desarrollo o prometer fechas inciertas, las funciones planificadas (Google Pay, Apple Pay, seguimiento de pedidos, canje de puntos) se muestran visualmente con el componente <code>&lt;ProximamenteBadge /&gt;</code> en estado accesible deshabilitado.
            </p>
          </div>
        </div>
      </section>

      {/* Sección e: Wireframe vs. Pantalla final */}
      <section className="diseno-section" aria-labelledby="diseno-comparativa-title">
        <h2 id="diseno-comparativa-title" className="diseno-section-title">5. Wireframe vs. Pantalla final</h2>
        <p className="diseno-section-desc">
          Comparativa entre la estructura concebida en Figma y la interfaz funcional desarrollada en código:
        </p>

        <div className="diseno-comparativas-grid">
          {COMPARATIVAS.map((comp) => (
            <div key={comp.id} className="comparativa-card">
              <h3 className="comparativa-title">{comp.title}</h3>
              <div className="comparativa-pair">
                {/* Lado Wireframe */}
                <div className="comparativa-col">
                  <span className="comparativa-badge">Wireframe (Figma)</span>
                  <div
                    className="comparativa-img-wrap"
                    onClick={() => setZoomImage({ src: `/img/diseno/${comp.wireframe}`, alt: `Wireframe de ${comp.title}`, name: comp.title, desc: 'Estructura en baja fidelidad' })}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver wireframe ampliado de ${comp.title}`}
                  >
                    <img
                      src={`/img/diseno/${comp.wireframe}`}
                      alt={`Wireframe ${comp.title}`}
                      loading="lazy"
                      className="comparativa-img"
                    />
                  </div>
                </div>

                {/* Lado Pantalla Final */}
                <div className="comparativa-col">
                  <span className="comparativa-badge comparativa-badge--final">Pantalla final</span>
                  <div className="comparativa-img-wrap">
                    <FinalScreenPreview filename={comp.final} title={comp.title} onZoom={setZoomImage} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección f: Próximas mejoras y tecnología */}
      <section className="diseno-section" aria-labelledby="diseno-roadmap-title">
        <h2 id="diseno-roadmap-title" className="diseno-section-title">6. Próximas mejoras y stack tecnológico</h2>
        <div className="diseno-card">
          <div className="tech-stack-row">
            <span className="tech-pill">React 18</span>
            <span className="tech-pill">Vite</span>
            <span className="tech-pill">Supabase (PostgreSQL & RLS)</span>
            <span className="tech-pill">React Router DOM</span>
            <span className="tech-pill">CSS Variables semánticas</span>
            <span className="tech-pill">Mobile First</span>
          </div>

          <h3 className="diseno-card-title" style={{ marginTop: 'var(--space-4)' }}>Roadmap de evolución:</h3>
          <ul className="diseno-list">
            <li><strong>Pagos digitales integrados:</strong> Pasarelas directas con Google Pay y Apple Pay en el checkout.</li>
            <li><strong>Seguimiento de pedidos en tiempo real:</strong> Pantalla interactiva por etapas (recibido, en preparación en taller, despachado).</li>
            <li><strong>Catálogo extendido y canje de puntos:</strong> Sistema para canjear saldo acumulado por piezas y accesorios de autor.</li>
            <li><strong>Acceso social simplificado:</strong> Inicio de sesión con un clic usando cuentas de Google y Apple.</li>
          </ul>
        </div>
      </section>

      {/* Sección g: Enlace a Figma */}
      <section className="diseno-section diseno-figma-cta" aria-labelledby="diseno-figma-title">
        <h2 id="diseno-figma-title" className="diseno-section-title">7. Archivo de Figma</h2>
        <p className="diseno-section-desc">
          El prototipo interactivo original y los flujos UX se desarrollaron en Figma. Podés consultar el archivo en modo solo lectura:
        </p>
        <a
          href="https://www.figma.com/design/qgTbK2QcgE4j4NOWY99NVS/MADERAS?node-id=0-1&t=tHLEF4kK8sQMHjEr-1"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary figma-btn-link"
          aria-label="Ver prototipo en Figma (abre en una nueva pestaña)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
            <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
            <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
            <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
            <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
          </svg>
          <span>Ver prototipo en Figma</span>
        </a>
        <p className="figma-note">El prototipo está en construcción y puede tener modificaciones.</p>
      </section>

      {/* Modal de zoom accesible para wireframes */}
      {zoomImage && (
        <div
          className="zoom-modal-backdrop"
          onClick={() => setZoomImage(null)}
          role="presentation"
        >
          <div
            className="zoom-modal-container"
            role="dialog"
            aria-modal="true"
            aria-label={`Vista ampliada: ${zoomImage.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="zoom-close-btn"
              onClick={() => setZoomImage(null)}
              aria-label="Cerrar vista ampliada"
              autoFocus
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <img
              src={zoomImage.src}
              alt={zoomImage.alt}
              className="zoom-full-image"
            />
            {zoomImage.desc && (
              <div className="zoom-caption">
                <strong>{zoomImage.name}</strong> — {zoomImage.desc}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Muestra la imagen final si existe, o un elegante marcador "Captura pendiente" sin romper la pantalla.
 */
function FinalScreenPreview({ filename, title, onZoom }) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = `/img/diseno/${filename}`

  if (hasError) {
    return (
      <div className="final-screen-placeholder" aria-label={`Captura pendiente para ${title}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="placeholder-title">Captura pendiente</span>
        <span className="placeholder-sub">Disponible en la app en vivo</span>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={`Pantalla final interactiva de ${title}`}
      loading="lazy"
      className="comparativa-img"
      onError={() => setHasError(true)}
      onClick={() => onZoom({ src: imageSrc, alt: `Pantalla final de ${title}`, name: title, desc: 'Pantalla final interactiva' })}
    />
  )
}
