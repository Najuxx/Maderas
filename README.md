<div align="center">
  <img src="./public/img/logo.webp" alt="Logo MADERAS" width="280" />

  # MADERAS

  <p><strong>Catálogo móvil artesanal de piezas de madera noble con cuenta opcional, programa de puntos y cierre de pedidos por WhatsApp.</strong><br>
  Diseñado con enfoque mobile-first, accesibilidad integrada y cálculo seguro en el servidor.</p>

  <p>
    <a href="https://maderas.rf.gd" target="_blank" rel="noopener noreferrer"><strong>🌐 Visitar sitio publicado</strong></a> ·
    <a href="https://www.figma.com/design/qgTbK2QcgE4j4NOWY99NVS/MADERAS?node-id=0-1&t=bnAyQF1wMEYXJkoI-1" target="_blank" rel="noopener noreferrer"><strong>🎨 Ver prototipo en Figma</strong></a>
  </p>
  <p><em>(El prototipo en Figma está en construcción y puede tener modificaciones).</em></p>
</div>

---

## 📸 Capturas de pantalla

<!-- Marcadores para colocar las capturas en docs/capturas/ -->
| Inicio (Home) | Catálogo | Detalle de Producto |
|:---:|:---:|:---:|
| ![Inicio](./docs/capturas/home.png) | ![Catálogo](./docs/capturas/catalogo.png) | ![Detalle de Producto](./docs/capturas/producto.png) |

| Carrito de Compras | Perfil de Usuario |
|:---:|:---:|
| ![Carrito](./docs/capturas/carrito.png) | ![Perfil](./docs/capturas/perfil.png) |

---

## ✨ Funcionalidades

- **Catálogo interactivo:** Exploración de piezas artesanales con buscador en tiempo real, guardado de búsquedas recientes en `localStorage`, filtrado por categoría (Tablas, Bowls, Mobiliario), por madera noble y por rango de precio.
- **Carrito de compras:** Control de cantidades con áreas táctiles de 48 px, desglose de subtotal, descuento por puntos aplicable y total. Cierre directo de pedido por **WhatsApp** con el detalle formateado automáticamente.
- **Favoritos:** Marcado rápido de piezas preferidas con persistencia segura en Supabase.
- **Cuenta opcional (modo invitado):** Cualquier usuario puede explorar, armar su carrito y comprar sin necesidad de registrarse. La aplicación nunca bloquea la compra por falta de cuenta.
- **Programa de puntos y niveles:** Registro con 500 puntos de bienvenida y nivel 3 inicial. Cada $5.000 abonados suman 500 puntos contables; cada 1.000 puntos otorgan 5% de descuento directo (hasta un tope del 20%). Los puntos se acumulan y no se gastan.
- **Perfil de usuario:** Selección de 8 avatares artesanales SVG adaptados a la paleta, apodo público, madera preferida y ciudad. Zona de peligro separada para eliminación definitiva de cuenta mediante tipeo exacto de la palabra "BORRAR".
- **Panel flotante de accesibilidad:** Herramientas integradas para alternar tamaño tipográfico (A / A+ / A++), tema oscuro, modo alto contraste, subrayado de enlaces/botones, aumento del espaciado entre caracteres y pausa de animaciones (respetando `prefers-reduced-motion`).
- **Preguntas frecuentes (`/faq`):** Acordeón accesible con botones semánticos (`aria-expanded` y `aria-controls`), navegación por teclado y apertura de múltiples consultas simultáneas desde un archivo estructurado JSON.
- **Términos y condiciones (`/terminos`):** Texto estructurado con aviso destacado y un contenedor centrado con ancho de lectura cómodo de ~68 caracteres.
- **"Detrás del diseño" (`/diseno`):** Sección pedagógica que documenta el problema, los usuarios, las decisiones de tokens, una galería interactiva con 37 wireframes en WebP con modal de zoom y comparativas lado a lado.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite (JavaScript modular)
- **Enrutamiento:** `react-router-dom` v6 con rutas dinámicas, code-splitting (`React.lazy` y `Suspense`) y protección de rutas privadas con `ProtectedRoute`
- **Backend & Base de Datos:** [Supabase](https://supabase.com) (PostgreSQL, Row Level Security estricto y funciones RPC `SECURITY DEFINER`)
- **Estilos:** CSS Vanilla modular con tokens semánticos en variables nativas, sin librerías pesadas externas de componentes
- **Hosting & Deploy:** Alojamiento en InfinityFree con reglas `.htaccess` para soporte de SPA al refrescar, y pipeline automatizado de subida por FTPS mediante `basic-ftp`

---

## 💻 Cómo correrlo en local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Najuxx/Maderas.git
cd MADERAS
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copiá el archivo de plantilla `.env.example` para crear tu `.env.local` (este archivo está ignorado en Git):
```bash
cp .env.example .env.local
```

Abrí `.env.local` y completá las variables con tus credenciales:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_NUMBER=
FTP_HOST=
FTP_USER=
FTP_PASSWORD=
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

---

## 🚀 Cómo publicar

La compilación y el despliegue a producción están automatizados mediante scripts en Node.js:

1. **Compilar la aplicación para producción:**
   ```bash
   npm run build
   ```
   Genera la carpeta `dist/` optimizada, con las rutas divididas en módulos livianos y sin advertencias de tamaño.

2. **Simular el despliegue (modo seguro dry-run):**
   ```bash
   npm run deploy:check
   ```
   Verifica la conexión con el servidor FTP y lista los archivos a transferir sin realizar modificaciones remotas.

3. **Publicar en el servidor:**
   ```bash
   npm run deploy
   ```
   Compila el proyecto y transfiere los archivos a la carpeta remota `/htdocs` mediante conexión FTPS segura (con fallback a FTP plano si el servidor no admite cifrado).

> **Importante:** Las credenciales de despliegue (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`) deben residir **exclusivamente en tu archivo `.env.local` local**. Nunca las incluyas en archivos de seguimiento ni las compartas en el repositorio.

---

## 🗄️ Esquema de datos y reglas de puntos

Toda la lógica contable y de pedidos se ejecuta en el motor de base de datos de Supabase a través del archivo `supabase/maderas_supabase.sql`. La aplicación cliente jamás calcula ni altera saldos por cuenta propia.

### Tablas en Supabase
- `config`: Claves y valores del sistema (monto por bloque, puntos por bloque, pasos de descuento, puntos de bienvenida y nivel inicial).
- `products`: Catálogo público con nombre, descripción, precio, categoría, material, stock, imagen y destacados.
- `profiles`: Perfiles de usuario protegidos por RLS. Solo se permite actualizar: `full_name`, `phone`, `avatar`, `apodo`, `material_favorito` y `ciudad` (las columnas `id` y `nivel` están bloqueadas ante modificaciones del cliente).
- `favorites`: Claves foráneas vinculando usuario y producto con permisos individuales.
- `orders` y `order_items`: Pedidos guardados con cálculo de subtotal, descuento y total congelados al momento de la compra.
- `points_ledger`: Libro contable de movimientos de puntos de solo inserción (motivos: `bienvenida`, `compra`, `ajuste`).

### Funciones RPC en el servidor
- `mi_estado()`: Retorna `puntos`, `descuento_pct` y `nivel` del usuario autenticado.
- `crear_pedido(p_items)`: Valida stock, calcula subtotales, aplica el porcentaje de descuento vigente, registra el pedido y acredita los puntos correspondientes en una sola transacción segura.
- `eliminar_mi_cuenta()`: Elimina al usuario de `auth.users`, desencadenando el borrado en cascada de su perfil, favoritos, pedidos y puntos.

### Reglas de negocio
- **Bienvenida:** Al registrarse se otorgan **500 puntos** y se comienza en **nivel 3**.
- **Nivel:** Habilita personalización de perfil a partir de **nivel 3** (avatar, apodo, madera favorita y ciudad).
- **Puntos por compra:** Cada **$5.000** pagados (sobre el monto neto con descuento) acreditan **500 puntos**.
- **Descuento:** Cada **1.000 puntos** acumulados otorgan un **5% de descuento** directo en compras con cuenta, con un **tope del 20%**. Los puntos no se debitan al usar el descuento: se acumulan permanentemente.

---

## 🎨 Decisiones de diseño y accesibilidad

- **Mobile First:** Maquetado sobre una retícula base de 412 × 917 px con áreas táctiles garantizadas de al menos 48 × 48 px en botones, chips e íconos.
- **Paleta y tokens:** Basada en tonos maderas naturales: `--crema` (#ede0d4), `--arena` (#e6ccb2), `--miel` (#ddb892), `--canela` (#9c6644), `--nuez` (#7f5539) y `--texto` (#2b1d14), cumpliendo con los estándares de contraste de WCAG 2.2 nivel AA (con ratio de hasta 12.58:1 en texto base).
- **Cierre por WhatsApp:** Comunicación directa y transparente entre comprador y taller para convenir detalles de entrega y pago sin intermediarios forzados.
- **Documentación ampliada:** Podés consultar la memoria completa del proceso de diseño, la paleta y los wireframes visitando la sección interna **[/diseno](https://maderas.rf.gd/diseno)**.

---

## 🔮 Próximas mejoras (Roadmap)

De acuerdo con la sección 12 de `DESIGN.md`, las siguientes funcionalidades se encuentran planificadas:

- [ ] Métodos de pago directos con Google Pay y Apple Pay en la pantalla de confirmación.
- [ ] Inicio de sesión rápido con cuentas de Google y Apple.
- [ ] Pantalla interactiva de seguimiento de pedidos por etapas (recibido, en taller, despachado).
- [ ] Canje de puntos acumulados por piezas y accesorios de autor.
- [ ] Configuración avanzada de notificaciones por WhatsApp y correo electrónico.

---

## 🔒 Seguridad

- El archivo `.env.local` se encuentra explícitamente ignorado mediante `.gitignore` y **no forma parte del repositorio**.
- No existen claves secretas, contraseñas ni cadenas de conexión hardcodeadas en el código fuente.
- En el cliente únicamente se utilizan la URL pública y la clave anónima (`anon key`) de Supabase; nunca se emplea la clave de servicio (`service_role`).

---

## ℹ️ Aviso legal

> **Sitio demostrativo.** Imágenes de productos generadas con IA con fines ilustrativos. Los productos, descripciones y precios exhibidos son conceptuales y forman parte de un proyecto de diseño y desarrollo web.
