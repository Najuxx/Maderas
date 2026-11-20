import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

// Componente de carga para Suspense
function PageLoading() {
  return (
    <div className="page-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-busy="true" aria-live="polite">
      <div className="product-skeleton-card" style={{ width: '100%', maxWidth: '400px', height: '180px', borderRadius: 'var(--radius-lg)' }} />
    </div>
  )
}

// Carga diferida (code-splitting con React.lazy) para optimizar rendimiento
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Catalogo = lazy(() => import('./pages/Catalogo').then(m => ({ default: m.Catalogo })))
const ProductoDetalle = lazy(() => import('./pages/ProductoDetalle').then(m => ({ default: m.ProductoDetalle })))
const Favoritos = lazy(() => import('./pages/Favoritos').then(m => ({ default: m.Favoritos })))

const Carrito = lazy(() => import('./pages/Carrito').then(m => ({ default: m.Carrito })))
const ConfirmarPedido = lazy(() => import('./pages/ConfirmarPedido').then(m => ({ default: m.ConfirmarPedido })))
const PedidoEnviado = lazy(() => import('./pages/PedidoEnviado').then(m => ({ default: m.PedidoEnviado })))
const PedidoError = lazy(() => import('./pages/PedidoError').then(m => ({ default: m.PedidoError })))
const PedidoSeguimiento = lazy(() => import('./pages/PedidoSeguimiento').then(m => ({ default: m.PedidoSeguimiento })))

const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Registro = lazy(() => import('./pages/Registro').then(m => ({ default: m.Registro })))
const RecuperarContrasena = lazy(() => import('./pages/RecuperarContrasena').then(m => ({ default: m.RecuperarContrasena })))
const RestablecerContrasena = lazy(() => import('./pages/RestablecerContrasena').then(m => ({ default: m.RestablecerContrasena })))

const Perfil = lazy(() => import('./pages/Perfil').then(m => ({ default: m.Perfil })))
const PerfilEditar = lazy(() => import('./pages/PerfilEditar').then(m => ({ default: m.PerfilEditar })))
const PerfilDatos = lazy(() => import('./pages/PerfilDatos').then(m => ({ default: m.PerfilDatos })))
const PerfilPuntos = lazy(() => import('./pages/PerfilPuntos').then(m => ({ default: m.PerfilPuntos })))
const PerfilNotificaciones = lazy(() => import('./pages/PerfilNotificaciones').then(m => ({ default: m.PerfilNotificaciones })))

const Faq = lazy(() => import('./pages/Faq').then(m => ({ default: m.Faq })))
const Terminos = lazy(() => import('./pages/Terminos').then(m => ({ default: m.Terminos })))
const Diseno = lazy(() => import('./pages/Diseno').then(m => ({ default: m.Diseno })))

const Proximamente = lazy(() => import('./pages/Proximamente').then(m => ({ default: m.Proximamente })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas principales */}
        <Route path="/" element={<Suspense fallback={<PageLoading />}><Home /></Suspense>} />
        <Route path="/catalogo" element={<Suspense fallback={<PageLoading />}><Catalogo /></Suspense>} />
        <Route path="/producto/:id" element={<Suspense fallback={<PageLoading />}><ProductoDetalle /></Suspense>} />
        <Route path="/favoritos" element={<Suspense fallback={<PageLoading />}><Favoritos /></Suspense>} />

        {/* Carrito y flujo de pedido */}
        <Route path="/carrito" element={<Suspense fallback={<PageLoading />}><Carrito /></Suspense>} />
        <Route path="/carrito/confirmar" element={<Suspense fallback={<PageLoading />}><ConfirmarPedido /></Suspense>} />
        <Route path="/pedido-enviado" element={<Suspense fallback={<PageLoading />}><PedidoEnviado /></Suspense>} />
        <Route path="/pedido-error" element={<Suspense fallback={<PageLoading />}><PedidoError /></Suspense>} />
        <Route path="/pedido-seguimiento" element={<Suspense fallback={<PageLoading />}><PedidoSeguimiento /></Suspense>} />

        {/* Autenticación y cuenta */}
        <Route path="/login" element={<Suspense fallback={<PageLoading />}><Login /></Suspense>} />
        <Route path="/registro" element={<Suspense fallback={<PageLoading />}><Registro /></Suspense>} />
        <Route path="/recuperar" element={<Suspense fallback={<PageLoading />}><RecuperarContrasena /></Suspense>} />
        <Route path="/restablecer" element={<Suspense fallback={<PageLoading />}><RestablecerContrasena /></Suspense>} />

        {/* Rutas privadas de perfil (protegidas con ProtectedRoute) */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoading />}><Perfil /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/editar"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoading />}><PerfilEditar /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/datos"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoading />}><PerfilDatos /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/puntos"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoading />}><PerfilPuntos /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/notificaciones"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoading />}><PerfilNotificaciones /></Suspense>
            </ProtectedRoute>
          }
        />

        {/* Información y diseño */}
        <Route path="/faq" element={<Suspense fallback={<PageLoading />}><Faq /></Suspense>} />
        <Route path="/terminos" element={<Suspense fallback={<PageLoading />}><Terminos /></Suspense>} />
        <Route path="/diseno" element={<Suspense fallback={<PageLoading />}><Diseno /></Suspense>} />

        {/* Próximamente y 404 */}
        <Route path="/proximamente" element={<Suspense fallback={<PageLoading />}><Proximamente /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoading />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  )
}

export default App
