# ByteDigital Front

Storefront de e-commerce para **ByteDigital**, tienda de tecnologia chilena. Aplicacion SSR construida con Nuxt 3.

---

## Stack Tecnologico

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **Nuxt** | 3.21 | Framework SSR/SSG |
| **Vue** | 3.5 | UI reactiva |
| **Tailwind CSS** | 3.4 | Estilos utility-first |
| **shadcn-nuxt** | 2.4 | Componentes UI (Radix Vue) |
| **Lucide** | 0.577 | Iconografia |
| **VueUse** | 14.2 | Utilidades reactivas |
| **Vitest** | 4.0 | Testing unitario |

---

## Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **API Backend** corriendo en `http://localhost:8000` (bytedigital-api)

---

## Setup Paso a Paso

### 1. Clonar repositorio

```bash
git clone git@bitbucket.org:bytedigital/bytedigital-front.git
cd bytedigital-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

---

## Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
# URL de la API (servidor - usado en SSR)
NUXT_API_BASE=http://localhost:8000

# URL de la API (cliente - usado en browser)
NUXT_PUBLIC_API_BASE=http://localhost:8000

# Google Sign-In Client ID (opcional)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `NUXT_API_BASE` | `http://localhost:8000` | URL API para SSR (server-side) |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8000` | URL API para cliente (browser) |
| `NUXT_PUBLIC_GOOGLE_CLIENT_ID` | - | Client ID para Google Sign-In |
| `NITRO_PRESET` | `node-server` | Preset de deploy para Nitro |

---

## Comandos Principales

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila para produccion (SSR) |
| `npm run generate` | Genera sitio estatico (SSG) |
| `npm run preview` | Preview del build de produccion |
| `npm run test` | Ejecuta tests unitarios |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

---

## Estructura del Proyecto

```
bytedigital-front/
├── assets/              # Estilos globales (CSS)
├── components/
│   ├── home/           # Componentes de homepage
│   ├── layout/         # Header, Footer, SearchBar
│   ├── product/        # ProductCard, ProductGrid, Filters
│   └── ui/             # Componentes base (shadcn)
├── composables/         # Logica reutilizable (useAuth, useCart, etc.)
├── layouts/             # Layout default con header/footer
├── lib/                 # Utilidades (cn helper)
├── middleware/          # auth, maintenance
├── pages/               # Rutas del sitio
├── types/               # TypeScript interfaces
├── utils/               # Funciones helper (formatCLP)
└── tests/               # Tests unitarios
```

---

## Build y Deploy

### Build SSR (produccion)

```bash
npm run build
node .output/server/index.mjs
```

### Docker

```bash
# Build imagen
docker build -t bytedigital-front .

# Run contenedor
docker run -p 3000:3000 \
  -e NUXT_API_BASE=http://api:8000 \
  -e NUXT_PUBLIC_API_BASE=https://api.bytedigital.cl \
  bytedigital-front
```

### Con Docker Compose (recomendado)

Usar el repositorio `bytedigital-devops` para orquestar todos los servicios:

```bash
cd ../bytedigital-devops
make up
```

---

## Testing

```bash
# Ejecutar todos los tests
npm run test

# Modo watch (desarrollo)
npm run test:watch

# Con cobertura
npm run test:coverage
```

Los tests estan en `/tests/` y usan:
- **Vitest** como test runner
- **happy-dom** para simular el DOM
- **@vue/test-utils** para testing de componentes

---

## Documentacion Tecnica

Documentacion detallada disponible en [`/docs`](./docs/README.md):

- [Arquitectura del proyecto](./docs/ARCHITECTURE.md)
- [Composables](./docs/composables.md)
- **Modulos:**
  - [Autenticacion](./docs/modules/auth.md)
  - [Carrito](./docs/modules/cart.md)
  - [Checkout](./docs/modules/checkout.md)
  - [Mi Cuenta](./docs/modules/account.md)
  - [Catalogo](./docs/modules/catalog.md)

---

## Licencia

Propiedad de ByteDigital SpA. Todos los derechos reservados.
