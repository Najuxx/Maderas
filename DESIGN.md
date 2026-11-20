# MADERAS · Guía de diseño y producto

> **Para el agente:** leé este archivo completo y mirá las imágenes de `docs/diseno/` antes de escribir código.
> Cuando una pantalla se pida en una tarea, abrí la imagen indicada en la tabla de la sección 6.

## 1. Qué es

MADERAS es un catálogo móvil de piezas de madera artesanales. El usuario explora productos, los filtra, guarda
favoritos, arma un carrito y cierra el pedido por WhatsApp. La cuenta es **opcional** y suma puntos que dan descuentos.

Es el práctico final de un curso de React y a la vez una pieza de portfolio de diseño UX/UI.
El diseño original está en Figma (baja fidelidad). Esta guía traduce ese trabajo a una implementación.

**Stack:** Vite + React (JavaScript), react-router-dom (BrowserRouter), @supabase/supabase-js, CSS plano con variables.
**Hosting:** build estático subido a InfinityFree. **Backend:** Supabase (login, productos, favoritos, pedidos, puntos).

## 2. Cómo leer las imágenes

- Son **wireframes en baja fidelidad** (grises). Definen **estructura, jerarquía y componentes**, no el aspecto final.
- **Los colores salen de la paleta de la sección 3**, no del gris de los wireframes.
- El texto "Lorem ipsum" es de relleno: reemplazalo por contenido real en español.
- Las pantallas miden 412 × 917 px: diseñá **mobile-first**. Aplicá las reglas de responsive de la sección 5 (móvil <640px, tablet 640-899px, escritorio ≥900px hasta 1200px).
- Si una imagen contradice la sección 10 ("Correcciones"), **manda la sección 10**.

## 3. Paleta y tokens

```css
:root {
  --crema:    #ede0d4; /* fondo general */
  --arena:    #e6ccb2; /* tarjetas y superficies */
  --miel:     #ddb892; /* chips, estados inactivos */
  --caramelo: #b08968; /* SOLO decorativo (contraste 2.45 sobre crema: nunca para texto) */
  --nuez:     #7f5539; /* botón principal, títulos */
  --canela:   #9c6644; /* enlaces, estados activos (texto grande o íconos) */
  --texto:    #2b1d14; /* texto principal (agregado para contraste) */
  --error:    #9b1c1c; /* 6.29 sobre crema */
  --exito:    #2f6b3a; /* 4.94 sobre crema */
}
```

| Uso | Combinación | Contraste |
|---|---|---|
| Texto normal | `--texto` sobre `--crema` | 12.58 |
| Texto sobre tarjeta | `--texto` sobre `--arena` | ≥ 8 |
| Botón principal | `--crema` o blanco sobre `--nuez` | 4.97 / 6.44 |
| Botón secundario | blanco sobre `--canela` | 4.78 |
| Enlaces | `--nuez` sobre `--crema` | 4.97 |

- `--canela` sobre crema da 3.69: usalo solo en texto grande (≥ 24 px, o 19 px en negrita) e íconos.
- `--caramelo` y `--miel` no llevan texto chico encima.
- **Tema oscuro:** fondo `--texto` (#2b1d14), texto `--crema` (12.58), acentos `--miel` (8.8) y `--caramelo` (5.14).
- El color nunca es el único indicador: los errores llevan ícono y texto además del color.

## 4. Tipografía, forma y espaciado

- Tipografía provisoria: **Roboto** (la de los wireframes), con fallback `system-ui, sans-serif`. Tamaño base 16 px.
- Esquinas muy redondeadas (aprox. 16–24 px en tarjetas, píldoras en chips y botones).
- Áreas táctiles de **al menos 48 × 48 px** (botones, íconos, chips, cantidad del carrito, cierre de paneles).
- Espaciado en múltiplos de 4 px. Título de pantalla centrado, contenido alineado a la izquierda.

## 5. Estructura global (todas las pantallas)

- **Header:** a la izquierda, flecha atrás (en Home, el logo); centro, logo con el nombre debajo; a la derecha,
  botón de tema opcional (luna/sol, 48 px), ícono de carrito (con contador de productos) e ícono de perfil, en círculos de 48 px.
  El logo tiene **el mismo tamaño en todas las pantallas** (versión compacta en las internas).
  En escritorio (900 px o más), el header incluye navegación horizontal (Inicio, Catálogo, Carrito).
- **Navbar inferior:** de 3 ítems: **Inicio, Catálogo, Carrito**. El ítem activo va resaltado.
  (El carrito está también en el header: decisión tomada, se mantienen los dos).
  En escritorio (900 px o más) se oculta automáticamente.
- **Un único botón flotante de accesibilidad** (ícono de persona) que abre el panel de accesibilidad.
  El botón **no aparece** en login, registro, skeleton ni dentro de modales y paneles.
- **Skeleton** mientras cargan datos, **estado de error con "Reintentar"** y página 404.

**Reglas de RESPONSIVE:**
- **Móvil (menos de 640 px):** igual a los wireframes. Grilla de 2 columnas y navbar inferior.
- **Tablet (640 a 899 px):** grilla de 3 columnas, contenedor más ancho.
- **Escritorio (900 px o más):** contenedor de hasta 1200 px; la navbar inferior se oculta y el header pasa a tener navegación horizontal (Inicio, Catálogo, Carrito); grilla de 4 columnas; carrusel de destacados con más tarjetas visibles. Pie de página con enlaces a `/faq` y `/terminos`.
- Solo CSS con variables y media queries. El botón de accesibilidad se mantiene.

## 6. Rutas y pantallas

Estado: **MVP** = se implementa; **Próximamente** = se muestra deshabilitado con la etiqueta (sección 12).

| Ruta | Imagen(es) en `docs/diseno/` | Qué muestra | Estado |
|---|---|---|---|
| `/` | `home.png` | Buscador con filtro, título "Parte de nuestras bonitas piezas de madera", carrusel de destacados (`featured`), chips de categorías, grilla de productos | MVP |
| `/catalogo` | `catalogo-0.png` … `catalogo-3.png` | Mismo layout; cada imagen es una categoría distinta seleccionada (chip resaltado) | MVP |
| `/catalogo` (panel de filtros) | `filtros.png`, `filtros-quitando.png` | Panel bajo el buscador con filtros por categoría, material y precio; chips activos con X; "Aplicar" y "Limpiar" | MVP |
| `/catalogo` (sin resultados) | `filtros-sin-resultados.png` | Mensaje de sin resultados + "Productos que podrían interesarte" | MVP |
| `/catalogo` (búsqueda activa) | `catalogo-busquedas-recientes.png` | Búsquedas recientes (guardadas en localStorage), cada una con X | MVP |
| `/producto/:id` | `producto.png` | Imagen grande con corazón (favorito), nombre, precio, botón agregar al carrito, miniaturas, relacionados | MVP |
| Zoom de producto | `producto-zoom.png` | Imagen ampliada a pantalla completa con botón de cerrar | MVP |
| `/favoritos` | `favoritos.png`, `favoritos-vacio.png` | Lista con agregar al carrito y quitar; estado vacío con botón "Ir al catálogo" | MVP |
| `/carrito` | `carrito.png`, `carrito-vacio.png` | Ítems con cantidad, subtotal, descuento, total y botón principal; vacío con "Ir al catálogo" | MVP |
| `/carrito/confirmar` | `pedido-confirmar.png` | Resumen del pedido y forma de cierre: WhatsApp activo; Google Pay y Apple Pay "Próximamente" | MVP |
| `/pedido-enviado` | `pedido-enviado.png` | Confirmación de pedido enviado, con puntos ganados | MVP |
| Error de pedido | `pedido-error.png` | Aviso de que no se pudo enviar el pedido, con "Reintentar" | MVP |
| `/login` | `login.png`, `login-error-email.png`, `login-error-contrasena.png` | Email y contraseña, errores por campo | MVP |
| `/registro` | `registro.png` | Registro con indicador de seguridad de la contraseña, aceptación de términos y enlace a login | MVP |
| `/recuperar` | `recuperar-contrasena.png` | Pedir email para recuperar la contraseña | MVP |
| `/restablecer` | `restablecer-contrasena.png` | Nueva contraseña y repetirla (llega desde el enlace del correo) | MVP |
| `/perfil` | `perfil.png` | Menú: puntos, editar perfil, favoritos y pedidos (la fila de pedidos va como Próximamente); botón de cerrar sesión separado | MVP |
| Cerrar sesión | `perfil-cerrar-sesion.png` | Modal de confirmación | MVP |
| `/perfil/editar` | `perfil-editar.png` | Lista de secciones editables y borrar cuenta (separada) | MVP |
| `/perfil/datos` | `perfil-datos.png` | Edición de datos y personalización (requiere nivel 3) | MVP |
| Borrar cuenta | `perfil-borrar-cuenta.png` | Modal con confirmación escrita | MVP |
| `/perfil/puntos` | `puntos.png` | Nivel (estrellas), puntos, descuento vigente, progreso y reglas | MVP |
| `/faq` | `faq.png` | Preguntas frecuentes en acordeón | MVP |
| `/terminos` | `terminos.png` | Términos y condiciones | MVP |
| Panel de accesibilidad | `accesibilidad-panel.png` | Panel flotante con opciones (sección 9) | MVP |
| Estados del sistema | `skeleton.png`, `sin-conexion.png` | Carga y sin conexión | MVP |
| `/perfil/notificaciones` | `perfil-notificaciones.png` | Preferencias de notificaciones | Próximamente |
| Seguimiento de pedido | `pedido-seguimiento.png` | Barras de progreso por estado | Próximamente |
| `/diseno` | (ver sección 14) | "Detrás del diseño" | MVP |
| `/proximamente` | — | Pantalla genérica de próximas mejoras | MVP |

## 7. Reglas de negocio

**Cuenta opcional**
- Sin cuenta: se navega, se usa el carrito y se compra por WhatsApp. No se guarda el pedido ni se suman puntos.
- Pedir cuenta (panel inferior con **"Crear cuenta" / "Iniciar sesión" / "Ahora no"**) al intentar: guardar un favorito,
  entrar a puntos o personalizar el perfil. "Ahora no" cierra el panel y no vuelve a insistir en esa sesión.
- En el carrito de un invitado, mostrar: "Con una cuenta, esta compra te suma N puntos".
- Al crear la cuenta se otorgan **500 puntos de bienvenida** y se empieza en **nivel 3**.

**Nivel y descuento (son cosas separadas)**
- **Nivel:** habilita funciones. El nivel 3 permite personalizar el perfil (avatar, apodo, material favorito, ciudad).
- **Descuento:** depende solo de los puntos acumulados: **5% por cada 1000 puntos, con tope de 20%**.

**Puntos**
- Cada **$5000** pagados suman **500 puntos** (por bloques completos: $9999 suma 500).
- Los puntos se calculan sobre lo que realmente se paga, ya con descuento.
- Los puntos no se gastan: acumulan. El canje queda como "Próximamente".

**Todo se calcula en el servidor.** Los valores salen de la tabla `config` y de las funciones de `supabase/maderas_supabase.sql`.
La app **nunca** calcula ni escribe puntos o totales por su cuenta: solo muestra lo que devuelven las funciones.

**Cierre por WhatsApp**
1. Usuario logueado: `supabase.rpc('crear_pedido', { p_items })` guarda el pedido y devuelve el resumen.
2. Se abre `https://wa.me/<VITE_WHATSAPP_NUMBER>?text=<mensaje codificado>` con el detalle:

```
Hola, quiero hacer este pedido:
• 2 × Tabla de picar de nogal — $37.000
• 1 × Bowl artesanal de algarrobo — $14.200
Subtotal: $51.200 · Descuento 15%: −$7.680 · Total: $43.520
Pedido n.º 12
```

3. Invitado: mismo mensaje, sin guardar el pedido.

## 8. Datos (Supabase)

Se crean con `supabase/maderas_supabase.sql`. Resumen:

- `products`: se lee sin login. `profiles`, `favorites`, `orders`, `order_items`, `points_ledger`: cada usuario solo ve lo suyo (RLS).
- Funciones que llama la app: `mi_estado()` (puntos, descuento_pct, nivel), `crear_pedido(p_items)`, `eliminar_mi_cuenta()`.

```js
// Estado de puntos
const { data } = await supabase.rpc('mi_estado')            // → [{ puntos, descuento_pct, nivel }]
// Crear pedido
const { data, error } = await supabase.rpc('crear_pedido', {
  p_items: carrito.map(i => ({ product_id: i.id, qty: i.qty })),
})
```

- Variables en `.env.local` (nunca subirlo a GitHub): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`.
  Incluir `.env.example` sin valores. **Nunca usar la clave `service_role` en el front.**
- Carrito, búsquedas recientes y preferencias de accesibilidad: `localStorage`, siempre dentro de `try/catch`.
- Imágenes de productos en `public/img/productos/` (WebP, menos de 200 KB).

## 9. Accesibilidad

Panel de accesibilidad (`accesibilidad-panel.png`), titulado simplemente **"Accesibilidad"** (sin "WCAG"):

- Tamaño de texto: **A / A+ / A++**.
- Interruptores, todos **apagados por defecto** y cada uno con título y una línea de explicación:
  **Tema oscuro**, **Alto contraste**, **Subrayar enlaces y botones**, **Más espacio en el texto**,
  **Pausar animaciones**, **Resaltar el foco**.
- Botón "Reiniciar". Las preferencias se guardan y se aplican con atributos en `<html>` (`data-theme`, `data-texto`, etc.).
- Respetar `prefers-reduced-motion` y `prefers-color-scheme` como valor inicial.
- Etiquetas `aria-label` en todos los íconos, foco visible, orden de tabulación lógico, `aria-live` en errores.
- Imágenes con `alt` descriptivo. Formularios con `<label>` real.

## 10. Correcciones sobre los wireframes (mandan sobre las imágenes)

**Flujo**
- Carrito: agregar **botón principal** abajo ("Finalizar pedido"), **número de cantidad** entre − y +, y separar la × (papelera)
  del selector. Mostrar subtotal, descuento y total.
- Carrito vacío: solo mensaje, ícono y botón "Ir al catálogo" (sin total, papelera ni datos de contacto).
- Confirmación: mostrar **resumen** (ítems, descuento, total) y el cierre por WhatsApp; no solo los medios de pago.
- Pantallas de resultado: la de éxito dice "Pedido enviado"; la de error **no** debe decir "Pago confirmado"
  (dice, por ejemplo, "No pudimos enviar tu pedido").
- Recuperar contraseña: pedir **un solo email** y enviar un **enlace** (no un código). Agregar la pantalla "Revisá tu correo".
- Registro: agregar botón "Crear cuenta" y enlace "¿Ya tenés cuenta? Iniciá sesión". El campo "Usuario" pasa a **Email**
  y "Conf. Usuario" se elimina (se confirma la contraseña, no el email).
- Acceso social (Google y Apple): visibles pero como **Próximamente** en esta versión. Sin Instagram.
- Zoom del producto: imagen a pantalla completa con cierre, no una variante del detalle.
- Favoritos: miniaturas alineadas sin superponerse a la barra del nombre; el título no repite el ícono de corazón.

**Consistencia**
- Un solo botón flotante (accesibilidad); el tema va en su panel. No mostrarlo en login, registro, skeleton ni modales.
- Logo del mismo tamaño en todas las pantallas.
- Cerrar sesión: modal **neutro** y de tamaño normal con "Cancelar" y "Cerrar sesión". El rojo se reserva para borrar cuenta.
- Borrar cuenta: campo de texto real ("Escribí BORRAR para confirmar") y botones "Cancelar" y "Eliminar cuenta".
  Separar esa opción del resto de la lista.
- Íconos sin fondos lilas sueltos; todos en la paleta. La opción "¿Cómo te identificás?" pasa a un selector con opciones
  y "Prefiero no decirlo", o se elimina.
- "Sin conexión": ícono de wifi tachado, título, una línea de explicación y botón real "Reintentar" (no un spinner).
- Skeleton sin botones flotantes.
- Chips de categorías y X de búsquedas recientes de 48 px de área táctil.

## 11. Textos y tono

- Español rioplatense con **voseo** ("Iniciá sesión", "Editá tus datos", "Seguí tu pedido") y **tildes correctas**
  (Catálogo, Contraseña, ¿Estás seguro/a?, Términos y condiciones, Puntos, Redirección).
- Nada en inglés: "points" → "puntos", "Lvl" → "Nivel".
- Contenido real y coherente: nombres, precios en pesos argentinos (`Intl.NumberFormat('es-AR')`) y descripciones. Cero "Lorem ipsum".
- "FAQ" en pantalla se muestra como **"Preguntas frecuentes"**.

## 12. Próximamente

Componente reutilizable `<ProximamenteBadge />` y una pantalla `/proximamente`. Los elementos se ven pero están
**deshabilitados** (`aria-disabled="true"`, texto visible "Próximamente", no solo color gris):

- Google Pay y Apple Pay (en `/carrito/confirmar`).
- Inicio de sesión con Google y Apple.
- Notificaciones (fila del perfil).
- Seguimiento de pedidos (fila del perfil).
- Canje de puntos (ícono de regalo en `/perfil/puntos`).

Mostrar en la pantalla genérica un texto breve ("Estamos trabajando en esto. ¡Pronto vas a poder usarlo!") y un botón para volver.
Sin fechas prometidas.

## 13. Criterios de aceptación (consigna del curso)

- Sitio **dinámico**: productos, usuarios, favoritos, pedidos y puntos vienen de Supabase.
- Publicado en InfinityFree con **URL pública**; las rutas internas funcionan **también al refrescar** (`.htaccess` en `public/`).
- **Navegación sin errores**: sin errores en consola y sin enlaces rotos; probar siempre la versión publicada.
- Información **clara, coherente y consistente**: mismos nombres, precios y formatos en todas las pantallas.
- **Creatividad y presentación**: respetar este diseño y la ruta `/diseno`.
- Entrega: URL del proyecto, enlace de GitHub (con README) y enlace de LinkedIn. **Fecha límite: martes 24/11.**

`.htaccess` para `public/`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 14. Ruta `/diseno` · "Detrás del diseño"

Página para mostrar el proceso de Figma:

- Introducción breve: problema, usuarios y decisiones principales.
- Galería de wireframes (usar imágenes de `docs/diseno/`, convertidas a WebP y comprimidas, no los PNG originales).
- Comparaciones lado a lado: wireframe vs. pantalla final (Home, Catálogo, Producto, Carrito).
- Decisiones de **paleta y contraste** (tabla de la sección 3) y de **accesibilidad** (sección 9).
- Lista "Próximas mejoras" (sección 12).
- Enlace al archivo de Figma: `[PEGAR ENLACE DE FIGMA EN MODO SOLO LECTURA]`.

## 15. Cómo trabajar

1. Un paso por vez y esperá mi confirmación: estructura, tema y componentes → Home y Catálogo → Producto →
   Carrito y pedido por WhatsApp → cuenta y favoritos → puntos y descuentos → perfil → `/diseno`.
2. Explicame brevemente cada archivo que crees. Yo hago un commit después de cada paso.
3. Si algo no está definido acá ni en las imágenes, preguntame antes de inventarlo.
