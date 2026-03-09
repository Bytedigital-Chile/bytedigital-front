# Documentacion Tecnica - ByteDigital Front

Documentacion completa del storefront de ByteDigital.

---

## Indice

### Arquitectura

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Estructura del proyecto, flujos y diagramas

### Composables

- [composables.md](./composables.md) - Documentacion de todos los composables

### Modulos

| Modulo | Descripcion | Archivo |
|--------|-------------|---------|
| **Auth** | Login, registro, verificacion email, Google Sign-In | [auth.md](./modules/auth.md) |
| **Cart** | Carrito de compras, stock, sugerencias | [cart.md](./modules/cart.md) |
| **Checkout** | Proceso de pago, Flow | [checkout.md](./modules/checkout.md) |
| **Account** | Mi cuenta: datos, direcciones, compras, favoritos | [account.md](./modules/account.md) |
| **Catalog** | Categorias, busqueda, filtros, productos | [catalog.md](./modules/catalog.md) |

---

## Navegacion Rapida

### Por Funcionalidad

```
Autenticacion
├── /login                    → Login y registro
├── /verificar-email          → Verificacion de email
└── composables/useAuth.ts    → Logica de auth

Catalogo
├── /                         → Homepage
├── /categoria/[slug]         → Productos por categoria
├── /buscar                   → Resultados de busqueda
├── /producto/[slug]          → Detalle de producto
└── /campana/[slug]           → Pagina de campana

Carrito y Checkout
├── /carrito                  → Carrito de compras
├── /checkout                 → Proceso de pago
├── /pago/resultado           → Resultado del pago
└── composables/useCart.ts    → Logica del carrito

Mi Cuenta
├── /mi-cuenta/compras        → Historial de compras
├── /mi-cuenta/favoritos      → Productos favoritos
├── /mi-cuenta/datos          → Datos personales
├── /mi-cuenta/direcciones    → Direcciones de envio
├── /mi-cuenta/facturacion    → Datos de facturacion
└── /mi-cuenta/seguridad      → Cambio de contrasena
```

### Por Tipo de Archivo

```
Componentes UI
└── components/ui/            → Button, Badge, Card, Input

Componentes de Layout
└── components/layout/        → TheHeader, TheFooter, SearchBar

Componentes de Producto
└── components/product/       → ProductCard, ProductGrid, Filters

Componentes de Home
└── components/home/          → HeroBanner, CategoryGrid, etc.
```

---

## API Endpoints Consumidos

### Publicos (sin auth)

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/banners/` | GET | Banners del hero |
| `/categories/` | GET | Listado de categorias |
| `/categories/{slug}` | GET | Detalle de categoria |
| `/categories/{slug}/filters` | GET | Filtros dinamicos |
| `/products/` | GET | Busqueda y listado |
| `/products/featured` | GET | Productos destacados |
| `/products/new` | GET | Productos nuevos |
| `/products/{slug}` | GET | Detalle de producto |
| `/brands/` | GET | Listado de marcas |
| `/offers/` | GET | Ofertas activas |
| `/campaigns/{slug}` | GET | Detalle de campana |
| `/site-config/` | GET | Configuracion del sitio |
| `/geography/regions` | GET | Regiones de Chile |
| `/geography/regions/{id}/comunas` | GET | Comunas por region |

### Autenticacion

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/customer-auth/login` | POST | Login con email/password |
| `/customer-auth/register` | POST | Registro de usuario |
| `/customer-auth/google` | POST | Login con Google |
| `/customer-auth/verify-email` | GET | Verificar email |
| `/customer-auth/resend-verification` | POST | Reenviar verificacion |
| `/customer-auth/me` | GET | Datos del usuario |
| `/customer-auth/me` | PUT | Actualizar datos |
| `/customer-auth/me/password` | PUT | Cambiar contrasena |

### Cuenta (requiere auth)

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/account/cart/` | GET | Obtener carrito |
| `/account/cart/items` | POST | Agregar item |
| `/account/cart/items/{id}` | PUT | Actualizar cantidad |
| `/account/cart/items/{id}` | DELETE | Eliminar item |
| `/account/cart/merge` | POST | Merge con localStorage |
| `/account/addresses` | GET/POST | Direcciones |
| `/account/addresses/{id}` | PUT/DELETE | CRUD direccion |
| `/account/orders/` | GET | Historial de ordenes |
| `/account/orders/checkout` | POST | Crear orden |
| `/account/orders/{number}` | GET | Detalle de orden |
| `/account/wishlist/` | GET | Lista de favoritos |
| `/account/wishlist/{id}` | POST/DELETE | Toggle favorito |
| `/account/billing` | GET/POST/PUT | Datos facturacion |

### Pagos

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/payment-gateways/active` | GET | Gateways disponibles |
| `/payments/create-flow` | POST | Iniciar pago Flow |
| `/payments/status/{order}` | GET | Estado del pago |

---

## Convenios

- **Precios**: Siempre enteros en CLP (pesos chilenos)
- **Idioma UI**: Espanol
- **Idioma codigo**: Ingles
- **Formato fechas**: `es-CL` locale
- **Autenticacion**: JWT en cookie `customer_token` (8 horas)
