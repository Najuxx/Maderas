# MADERAS · Catálogo artesanal de piezas de madera

MADERAS es una aplicación web mobile-first de catálogo de piezas artesanales de madera nobles (nogal, paraíso, algarrobo, eucalipto y pino). Permite explorar productos, filtrar por categorías, materiales y precios, gestionar favoritos, armar un carrito de compras y cerrar pedidos directamente a través de WhatsApp.

> Imágenes de productos generadas con IA, con fines ilustrativos.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite (JavaScript)
- **Enrutamiento:** `react-router-dom` con `BrowserRouter`
- **Backend & Base de Datos:** Supabase (PostgreSQL, RLS y RPC functions)
- **Estilos:** CSS plano modular con variables y tokens semánticos (sin dependencias externas de UI)
- **Accesibilidad:** Panel flotante integrado (tamaños A / A+ / A++, modo oscuro, alto contraste, subrayado, espaciado, animación pausada y foco visible)

---

## 🚀 Instalación y ejecución local

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd MADERAS
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Copiar `.env.example` a `.env.local` y completar con las credenciales correspondientes:
   ```bash
   cp .env.example .env.local
   ```
   *Nota: `.env.local` está ignorado en `.gitignore` y nunca debe subirse al repositorio.*

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Generar la build de producción:
   ```bash
   npm run build
   ```
