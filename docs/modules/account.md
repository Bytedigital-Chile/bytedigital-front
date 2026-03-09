# Modulo Mi Cuenta

Area de usuario autenticado para gestionar datos personales, direcciones, compras y favoritos.

---

## Componentes del Modulo

| Archivo | Descripcion |
|---------|-------------|
| `pages/mi-cuenta.vue` | Layout con sidebar |
| `pages/mi-cuenta/index.vue` | Redirect a compras |
| `pages/mi-cuenta/compras.vue` | Historial de compras |
| `pages/mi-cuenta/compras/[orderNumber].vue` | Detalle de orden |
| `pages/mi-cuenta/favoritos.vue` | Productos favoritos |
| `pages/mi-cuenta/datos.vue` | Datos personales |
| `pages/mi-cuenta/direcciones.vue` | Direcciones de envio |
| `pages/mi-cuenta/facturacion.vue` | Datos de facturacion |
| `pages/mi-cuenta/seguridad.vue` | Cambio de contrasena |

---

## Arquitectura

### Layout Mi Cuenta

**Archivo**: `pages/mi-cuenta.vue`

```vue
<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <nav class="bg-gray-50 rounded-xl p-2 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg"
            :class="isActive(item.to)
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
```

### Menu Items

| Ruta | Icono | Label |
|------|-------|-------|
| `/mi-cuenta/compras` | ShoppingBag | Compras |
| `/mi-cuenta/favoritos` | Heart | Productos favoritos |
| `/mi-cuenta/datos` | UserCog | Datos personales |
| `/mi-cuenta/direcciones` | MapPin | Direcciones |
| `/mi-cuenta/facturacion` | FileText | Datos de facturacion |
| `/mi-cuenta/seguridad` | Lock | Seguridad |

---

## Seccion: Compras

### Listado de Compras

**Archivo**: `pages/mi-cuenta/compras.vue`

```
┌─────────────────────────────────────────────────────────┐
│  Mis compras                                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ BD-123456                        [Pagado]       │    │
│  │ 15 ene 2024 · 3 productos        $1.829.970     │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ BD-123455                        [Enviado]      │    │
│  │ 10 ene 2024 · 1 producto         $299.990       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Estados de Orden

```typescript
function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_payment: "Pendiente de pago",
    paid: "Pagado",
    processing: "En proceso",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
  };
  return map[status] || status;
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}
```

### Detalle de Orden

**Archivo**: `pages/mi-cuenta/compras/[orderNumber].vue`

```
┌─────────────────────────────────────────────────────────┐
│  ← Volver a compras                                     │
├─────────────────────────────────────────────────────────┤
│  Orden BD-123456                          [Pagado]      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ [img] Laptop Gaming XYZ                         │    │
│  │       Cantidad: 2                $1.799.980     │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ [img] Mouse Wireless                            │    │
│  │       Cantidad: 1                $29.990        │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  Subtotal                           $1.829.970         │
│  Envio                              Gratis             │
│  Total                              $1.829.970         │
├─────────────────────────────────────────────────────────┤
│  Direccion de envio                                     │
│  Juan Perez                                             │
│  Av. Principal 123, Depto 45                           │
│  Providencia, Metropolitana                            │
└─────────────────────────────────────────────────────────┘
```

---

## Seccion: Favoritos

**Archivo**: `pages/mi-cuenta/favoritos.vue`

### Uso del Composable

```typescript
const { items, fetchWishlist, removeFromWishlist } = useWishlist();

onMounted(fetchWishlist);
```

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Productos favoritos                                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ [x]      │  │ [x]      │  │ [x]      │  │ [x]      │ │
│  │ [img]    │  │ [img]    │  │ [img]    │  │ [img]    │ │
│  │ Producto │  │ Producto │  │ Producto │  │ Producto │ │
│  │ $99.990  │  │ $149.990 │  │ $299.990 │  │ $49.990  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

El boton [x] elimina de favoritos.

---

## Seccion: Datos Personales

**Archivo**: `pages/mi-cuenta/datos.vue`

### Formulario

```typescript
const form = reactive({
  first_name: user.value?.first_name || "",
  last_name: user.value?.last_name || "",
  phone: user.value?.phone || "",
});

async function save() {
  await api("/customer-auth/me", { method: "PUT", body: form });
  await fetchUser();
}
```

### Campos

| Campo | Tipo | Validacion |
|-------|------|------------|
| Nombre | text | - |
| Apellido | text | - |
| Telefono | tel | Placeholder: +56 9 1234 5678 |

---

## Seccion: Direcciones

**Archivo**: `pages/mi-cuenta/direcciones.vue`

### Funcionalidades

- Listar direcciones
- Agregar nueva direccion
- Editar direccion existente
- Eliminar direccion
- Marcar como principal

### Formulario de Direccion

```typescript
const form = reactive({
  label: "Casa",
  street: "",
  number: "",
  apartment: "",
  comuna: "",
  region: "",
  recipient_name: "",
  is_default: false,
});
```

### Seleccion de Region/Comuna

```typescript
// Cargar regiones al montar
const regions = await api<Region[]>("/geography/regions");

// Watch region change → load comunas
watch(selectedRegionId, async (regionId) => {
  if (!regionId) return;
  const region = regions.value.find((r) => r.id === regionId);
  if (region) form.region = region.name;
  comunas.value = await api<ComunaOption[]>(`/geography/regions/${regionId}/comunas`);
});
```

### CRUD Operations

```typescript
// Crear
await api("/account/addresses", { method: "POST", body });

// Actualizar
await api(`/account/addresses/${id}`, { method: "PUT", body });

// Eliminar
await api(`/account/addresses/${id}`, { method: "DELETE" });
```

---

## Seccion: Facturacion

**Archivo**: `pages/mi-cuenta/facturacion.vue`

### Campos Chilenos

| Campo | Descripcion |
|-------|-------------|
| RUT | 76.123.456-7 |
| Razon social | Nombre empresa |
| Giro | Actividad economica (opcional) |
| Calle + Numero | Direccion fiscal |
| Region + Comuna | Ubicacion |

### Formulario

```typescript
const form = reactive({
  rut: "",
  razon_social: "",
  giro: "",
  street: "",
  number: "",
  comuna: "",
  region: "",
});
```

---

## Seccion: Seguridad

**Archivo**: `pages/mi-cuenta/seguridad.vue`

### Cambio de Contrasena

```typescript
const form = reactive({
  current_password: "",
  new_password: "",
});
const confirmPassword = ref("");

async function changePassword() {
  if (form.new_password !== confirmPassword.value) {
    message.value = "Las contrasenas no coinciden";
    return;
  }

  await api("/customer-auth/me/password", {
    method: "PUT",
    body: {
      current_password: form.current_password || undefined,
      new_password: form.new_password,
    },
  });
}
```

### Notas

- `current_password` puede ser vacio si solo tiene cuenta Google
- `new_password` minimo 8 caracteres

### Cuentas Vinculadas

Muestra si la cuenta tiene Google vinculado:

```vue
<div class="flex items-center gap-3">
  <span>Google</span>
  <span v-if="user?.google_linked" class="bg-green-100 text-green-700">
    Vinculada
  </span>
  <span v-else class="bg-gray-100 text-gray-500">
    No vinculada
  </span>
</div>
```

---

## Tipos

```typescript
interface CustomerAddress {
  id: number;
  label: string;
  street: string;
  number: string;
  apartment: string | null;
  comuna: string;
  region: string;
  zip_code: string | null;
  country: string;
  phone: string | null;
  recipient_name: string | null;
  is_default: boolean;
}

interface BillingProfile {
  id: number;
  rut: string;
  razon_social: string;
  giro: string | null;
  street: string;
  number: string;
  apartment: string | null;
  comuna: string;
  region: string;
  zip_code: string | null;
  country: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  shipping_name: string;
  shipping_street: string;
  shipping_number: string;
  shipping_apartment: string | null;
  shipping_city: string;
  shipping_region: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string | null;
  customer_email: string;
  items: OrderItem[];
  created_at: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string | null;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
}

interface Region {
  id: number;
  name: string;
  ordinal: number;
}

interface ComunaOption {
  id: number;
  name: string;
}
```

---

## API Endpoints

### Direcciones

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/account/addresses` | GET | Listar direcciones |
| `/account/addresses` | POST | Crear direccion |
| `/account/addresses/{id}` | PUT | Actualizar direccion |
| `/account/addresses/{id}` | DELETE | Eliminar direccion |

### Ordenes

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/account/orders/` | GET | Listar ordenes |
| `/account/orders/{number}` | GET | Detalle de orden |

### Facturacion

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/account/billing` | GET | Obtener perfil |
| `/account/billing` | POST | Crear perfil |
| `/account/billing` | PUT | Actualizar perfil |

### Wishlist

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/account/wishlist/` | GET | Listar favoritos |
| `/account/wishlist/{product_id}` | POST | Agregar favorito |
| `/account/wishlist/{product_id}` | DELETE | Eliminar favorito |

### Geografia

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/geography/regions` | GET | Listar regiones |
| `/geography/regions/{id}/comunas` | GET | Comunas por region |
