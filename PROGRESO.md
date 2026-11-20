# MADERAS · Estado de Avance y Registro de Progreso

**Fecha de relevamiento y actualización:** Noviembre de 2026  
**Proyecto:** MADERAS — Catálogo móvil artesanal de piezas de madera (React + Vite + Supabase)  
**Repositorio:** https://github.com/Najuxx/Maderas.git  
**Sitio en producción:** https://maderas.rf.gd  
**Documento rector:** `DESIGN.md` (especial atención a la Sección 10 "Correcciones sobre los wireframes" y Sección 14 "Ruta /diseno")

---

## 1. Resumen de Estado

Se completaron todas las tareas catalogadas previamente como "a medias" o "sin empezar" correspondientes a los Pasos 6, 7 y 8, respetando rigurosamente los componentes existentes, la paleta oficial, las reglas de negocio en Supabase y las correcciones de diseño.

- **Paso 6 (Perfil y Rutas Privadas):** Completado al 100%. Se implementó `ProtectedRoute` para proteger las rutas privadas; se desarrollaron `/perfil` (con avatar, apodo, nivel, puntos y menú completo), modal neutro de cerrar sesión, `/perfil/editar`, modal de confirmación escrita para eliminar cuenta ("BORRAR"), `/perfil/datos` (con selector de los 8 avatares SVG, select de 5 maderas, control de nivel 3 y guardado seguro sin exponer columna nivel), `/perfil/puntos` y `/perfil/notificaciones` (Próximamente).
- **Paso 7 (Contenido estático, Pie de página y /diseno):** Completado al 100%. Se desacopló el contenido a `src/content/faq.json` y `src/content/terminos.json` sin alterar ni inventar textos; se construyó el acordeón accesible con apertura múltiple en `/faq`; se formateó `/terminos` con ancho de 68ch; se actualizó `Footer` en todas las pantallas con enlace a WhatsApp y aviso de IA; se creó `scripts/optimize-wireframes.mjs` generando 37 imágenes WebP (< 50 KB cada una) en `public/img/diseno/` y se desarrolló la página interactiva `/diseno` completa con zoom, decisiones de paleta y comparativas lado a lado con fallback "Captura pendiente".
- **Paso 8 (Cierre, Optimización y Deploy):** Completado al 100%. Code-splitting implementado con `React.lazy` y `Suspense`, reduciendo el bundle inicial y eliminando todas las advertencias de compilación; `README.md` actualizado con esquema de entrega; `.env.example` saneado sin credenciales reales; script `deploy.mjs` verificado y protegido contra filtraciones.

---

## 2. Tabla de Estado Actual

| Paso / Componente | Elemento | Estado Anterior | Estado Actual | Detalle de la implementación |
|---|---|:---:|:---:|---|
| **Paso 6: Perfil** | `/perfil` | A medias | **Hecho** | Muestra avatar artesanal, apodo/nombre, nivel, saldo de puntos desde `mi_estado()`, enlaces a Puntos, Editar, Favoritos, Mis pedidos (badge), Notificaciones, FAQ, Términos y botón neutro de cerrar sesión. |
| | `/perfil/editar` | A medias | **Hecho** | Opciones organizadas: Datos personales, Personalización, Notificaciones (badge) y sección de peligro separada con botón de eliminar cuenta. |
| | `/perfil/datos` | A medias | **Hecho** | Formulario controlado con nombre, teléfono, ciudad, apodo, selector de 8 avatares SVG y material favorito (5 maderas). Muestra nivel 3 y guarda en `profiles` solo columnas autorizadas, nunca `nivel`. |
| | `/perfil/notificaciones` | A medias | **Hecho** | Pantalla Próximamente con badge, explicación clara de canales (WhatsApp y mail) y botón de regreso al perfil. |
| | Modal de cerrar sesión | Sin empezar | **Hecho** | Componente accesible `CerrarSesionModal` con estilo neutro (sin color rojo), atajo con Escape y confirmación con `signOut()`. |
| | Modal de eliminar cuenta | Sin empezar | **Hecho** | Componente `EliminarCuentaModal` con confirmación destructiva condicionada a escribir exactamente "BORRAR", invocación RPC a `eliminar_mi_cuenta()`, `signOut()` y aviso de salida. |
| | Rutas privadas | Sin empezar | **Hecho** | Componente guardián `ProtectedRoute` envolviendo `/perfil` y subrutas; si no hay sesión, muestra la pantalla "Necesitás una cuenta" con botones a `/login` y `/registro`. |
| **Paso 7: FAQ, Términos, Footer, /diseno** | `src/content/faq.json` | Sin empezar | **Hecho** | Archivo JSON con las 14 preguntas y respuestas canónicas del proyecto, consumido por `Faq.jsx`. |
| | `src/content/terminos.json` | Sin empezar | **Hecho** | Archivo JSON con las 12 secciones legales canónicas, consumido por `Terminos.jsx`. |
| | Acordeón `/faq` | A medias | **Hecho** | Botones semánticos con `aria-expanded`, `aria-controls` y soporte para múltiples secciones abiertas en simultáneo. |
| | Lectura `/terminos` | A medias | **Hecho** | Contenedor centrado con ancho de lectura de ~68 caracteres (`max-width: 68ch`). |
| | Pie de página (`Footer`) | A medias | **Hecho** | Incluye enlaces a FAQ, Términos, Detrás del diseño, WhatsApp dinámico (`VITE_WHATSAPP_NUMBER`) y aviso de imágenes generadas con IA. |
| | `scripts/optimize-wireframes.mjs` | Sin empezar | **Hecho** | Script con `sharp` que optimizó los 37 wireframes de `docs/diseno/` a WebP (< 50 KB c/u) en `public/img/diseno/`. |
| | `public/img/diseno/` | Sin empezar | **Hecho** | Directorio poblado con 37 imágenes WebP comprimidas y optimizadas para la web. |
| | `/diseno` ("Detrás del diseño") | A medias | **Hecho** | Página integral con: a) Introducción y usuarios; b) Proceso; c) Galería por flujos con zoom interactivo; d) Decisiones de diseño (paleta, contraste, accesibilidad, cuenta opcional); e) 4 comparativas lado a lado con fallback "Captura pendiente"; f) Roadmap de mejoras y stack; g) Botón Figma deshabilitado. |
| **Paso 8: Cierre** | Rendimiento y Code-Splitting | A medias | **Hecho** | Rutas divididas mediante `React.lazy` y `Suspense`. Build de producción en 1.19s con 0 advertencias y bundle inicial reducido a 429 kB. |
| | `README.md` | A medias | **Hecho** | Actualizado con descripción, tabla de capturas, reglas de Supabase, accesibilidad, variables de entorno sin credenciales reales y enlace a Figma. |
| | Seguridad de Credenciales | A medias | **Hecho** | `.env.example` limpio sin valores reales; `.env.local` confirmado en `.gitignore`; `scripts/deploy.mjs` saneado sin valores expuestos. |
| | Build (`npm run build`) | Hecho | **Hecho** | Compila limpiamente sin errores ni advertencias de tamaño. |
| | Deploy (InfinityFree / FTPS) | A medias | **Listo para ejecutar** | Script `deploy.mjs` probado en modo `--dry` y listo para que el usuario ejecute `npm run deploy`. |

---

## 3. Decisiones Técnicas y de Diseño Implementadas

1. **Separación estricta de responsabilidades (Sección 10):**
   - Modal de cerrar sesión con diseño neutro y tono amigable.
   - Color destructivo (`--error`) reservado exclusivamente para la acción de borrar la cuenta.
   - Seguridad en profiles: la app jamás intenta escribir sobre el campo `nivel` ni el `id` del usuario.
2. **Desacoplamiento de Contenido:**
   - FAQ y Términos leen de `src/content/*.json`. No existen textos embebidos en los componentes.
3. **Optimización Gráfica:**
   - Las 37 imágenes de diseño fueron procesadas a WebP con calidad 80 y un ancho máximo de 800px, logrando un peso promedio inferior a 15 KB por archivo.
4. **Resiliencia en Comparativas:**
   - Si no existen las capturas finales (`final-*.webp`), el componente `FinalScreenPreview` muestra un marcador estilizado "Captura pendiente" sin romper la grilla ni mostrar errores en consola.
5. **Rendimiento:**
   - Cada vista de página se carga diferida mediante `lazy()`, permitiendo una carga inicial ultrarrápida en dispositivos móviles.
