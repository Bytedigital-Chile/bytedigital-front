# Modulo de Catalogo

Navegacion, busqueda y visualizacion de productos.

---

## Componentes del Modulo

### Paginas

| Archivo | Ruta | Descripcion |
|---------|------|-------------|
| `pages/index.vue` | `/` | Homepage |
| `pages/categoria/[slug].vue` | `/categoria/:slug` | Productos por categoria |
| `pages/buscar.vue` | `/buscar` | Resultados de busqueda |
| `pages/producto/[slug].vue` | `/producto/:slug` | Detalle de producto |
| `pages/campana/[slug].vue` | `/campana/:slug` | Pagina de campana |

### Componentes de Producto

| Archivo | Props | Descripcion |
|---------|-------|-------------|
| `ProductCard.vue` | `product` | Tarjeta de producto |
| `ProductGrid.vue` | `products[]` | Grilla responsiva |
| `ProductGallery.vue` | `images[]` | Galeria con thumbnails |
| `ProductFilters.vue` | `brands, filters...` | Panel de filtros |
| `ProductSort.vue` | `modelValue` | Dropdown ordenamiento |
| `ProductSpecs.vue` | `specs, attribute_values` | Tabla especificaciones |
| `PriceDisplay.vue` | `product` | Precio con descuento |

### Componentes de Home

| Archivo | Props | Descripcion |
|---------|-------|-------------|
| `HeroBanner.vue` | `banners[]` | Carousel auto-rotante |
| `CategoryGrid.vue` | `categories[]` | Grilla de categorias |
| `FeaturedProducts.vue` | `products[]` | Productos destacados |
| `NewProducts.vue` | `products[]` | Productos nuevos |
| `OfferSection.vue` | `offers[]` | Ofertas activas |
| `RecommendedProducts.vue` | - | Vistos recientemente |

---

## Homepage

**Archivo**: `pages/index.vue`

### Estructura

```
┌─────────────────────────────────────────────────────────┐
│  [Hero Banner Carousel]                                 │
│  Auto-rotacion cada 5 segundos                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Envio   │ │ Compra  │ │Garantia │ │ Soporte │       │
│  │ gratis  │ │ segura  │ │         │ │  24/7   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│  Categorias                                             │
│  [Cat 1] [Cat 2] [Cat 3] [Cat 4] [Cat 5]               │
├─────────────────────────────────────────────────────────┤
│  Ofertas                                                │
│  [Prod 1] [Prod 2] [Prod 3] [Prod 4]                   │
├─────────────────────────────────────────────────────────┤
│  Productos destacados                                   │
│  [Prod 1] [Prod 2] [Prod 3] [Prod 4]                   │
├─────────────────────────────────────────────────────────┤
│  Nuevos productos                                       │
│  [Prod 1] [Prod 2] [Prod 3] [Prod 4]                   │
├─────────────────────────────────────────────────────────┤
│  Vistos recientemente                                   │
│  [Prod 1] [Prod 2] [Prod 3] [Prod 4]                   │
└─────────────────────────────────────────────────────────┘
```

### Carga de Datos (SSR)

```typescript
const { data, status } = await useAsyncData("home", async () => {
  const [banners, categories, offers, featured, newProducts] = await Promise.all([
    api<Banner[]>("/banners/?banner_type=hero"),
    api<Category[]>("/categories/"),
    api<Offer[]>("/offers/"),
    api<Product[]>("/products/featured"),
    api<Product[]>("/products/new"),
  ]);
  return { banners, categories, offers, featured, newProducts };
});
```

---

## Categoria

**Archivo**: `pages/categoria/[slug].vue`

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Inicio / Laptops                                       │
│  Laptops                                                │
├──────────────┬──────────────────────────────────────────┤
│  FILTROS     │  50 productos            [Ordenar: ▼]   │
│              │                                          │
│  Marca       │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  [ ] HP      │  │ Prod │ │ Prod │ │ Prod │ │ Prod │    │
│  [ ] Dell    │  └──────┘ └──────┘ └──────┘ └──────┘    │
│  [ ] Lenovo  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│              │  │ Prod │ │ Prod │ │ Prod │ │ Prod │    │
│  Condicion   │  └──────┘ └──────┘ └──────┘ └──────┘    │
│  [ ] Nuevo   │                                          │
│  [ ] Open Box│  [1] [2] [3] [4] [5]  Paginacion        │
│              │                                          │
│  Precio      │                                          │
│  Min [____]  │                                          │
│  Max [____]  │                                          │
│              │                                          │
│  RAM         │  ← Filtros dinamicos                     │
│  [ ] 8GB     │                                          │
│  [ ] 16GB    │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Estado de Filtros

```typescript
const filters = reactive({
  brand: "",
  condition: "",
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  sort: "newest",
  page: 1,
  attrFilters: {} as Record<string, string>,  // Filtros dinamicos
});
```

### Fetch de Productos

```typescript
async function fetchProducts() {
  loading.value = true;

  const params = new URLSearchParams();
  params.set("category_slug", route.params.slug as string);
  params.set("page", String(filters.page));
  params.set("page_size", "20");
  params.set("sort", filters.sort);

  if (filters.brand) params.set("brand_slug", filters.brand);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.minPrice) params.set("min_price", String(filters.minPrice));
  if (filters.maxPrice) params.set("max_price", String(filters.maxPrice));

  // Filtros dinamicos por atributo
  for (const [key, value] of Object.entries(filters.attrFilters)) {
    if (value) params.set(key, value);
  }

  const data = await api<PaginatedResponse<Product>>(`/products/?${params}`);
  products.value = data.items;
  total.value = data.total;
  pages.value = data.pages;

  loading.value = false;
}
```

### Filtros Dinamicos

La API retorna filtros especificos por categoria:

```typescript
const filtersData = await api<CategoryFilters>(`/categories/${slug}/filters`);
// { filters: [{ attribute_id, name, slug, options: [...] }, ...] }
```

---

## Busqueda

**Archivo**: `pages/buscar.vue`

### Parametros URL

```
/buscar?q=laptop
```

### Flujo

1. Usuario escribe en SearchBar
2. Debounce 300ms muestra dropdown con 8 resultados
3. Enter o click en "buscar" navega a `/buscar?q=xxx`
4. Pagina muestra resultados completos con filtros

### Composable useSearch

```typescript
export function useSearch() {
  const query = ref("");
  const results = ref<Product[]>([]);
  const loading = ref(false);
  const { api } = useApi();

  let timeout: ReturnType<typeof setTimeout>;

  watch(query, (val) => {
    clearTimeout(timeout);
    if (!val || val.length < 2) {
      results.value = [];
      return;
    }

    loading.value = true;
    timeout = setTimeout(async () => {
      const data = await api<PaginatedResponse<Product>>(
        `/products/?search=${encodeURIComponent(val)}&page_size=8`
      );
      results.value = data.items;
      loading.value = false;
    }, 300);
  });

  return { query, results, loading };
}
```

---

## Detalle de Producto

**Archivo**: `pages/producto/[slug].vue`

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Inicio / Laptops / Laptop Gaming XYZ                   │
├───────────────────────────┬─────────────────────────────┤
│                           │  HP                         │
│  ┌───────────────────┐    │  Laptop Gaming XYZ          │
│  │                   │    │                             │
│  │   [Main Image]    │    │  $899.990                   │
│  │                   │    │  $999.990  -10% dcto        │
│  └───────────────────┘    │                             │
│  [th1] [th2] [th3] [th4]  │  En stock (5 disponibles)   │
│                           │                             │
│                           │  [Nuevo]                    │
│                           │                             │
│                           │  [Agregar al carrito] [♡]   │
│                           │                             │
│                           │  Descripcion corta...       │
│                           │                             │
│                           │  SKU: ABC123                │
├───────────────────────────┴─────────────────────────────┤
│  Descripcion                                            │
│  Lorem ipsum dolor sit amet...                          │
├─────────────────────────────────────────────────────────┤
│  Especificaciones                                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Procesador    │ Intel Core i7-12700H            │    │
│  │ RAM           │ 16GB DDR5                       │    │
│  │ Almacenamiento│ 512GB NVMe SSD                  │    │
│  │ Pantalla      │ 15.6" FHD 144Hz                 │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Funcionalidades

```typescript
// Agregar al carrito
async function onAddToCart() {
  adding.value = true;
  const ok = await addToCart(product.value);
  if (ok) {
    showToast("Producto agregado al carrito");
  }
  adding.value = false;
}

// Toggle favoritos
function handleWishlist() {
  if (!isAuthenticated.value) {
    navigateTo(`/login?redirect=${route.fullPath}`);
    return;
  }
  toggleWishlist(product.value.id);
}

// Guardar en vistos recientemente
onMounted(async () => {
  product.value = await api<Product>(`/products/${route.params.slug}`);
  if (product.value) {
    addProduct(product.value);  // useRecentlyViewed
  }
});
```

### Etiquetas de Condicion

| Condicion | Estilo |
|-----------|--------|
| `new` | Verde - "Nuevo" |
| `open_box` | Amarillo - "Open Box" |
| `refurbished` | Azul - "Reacondicionado" |

---

## Componentes de Producto

### ProductCard

```vue
<template>
  <NuxtLink :to="`/producto/${product.slug}`" class="group">
    <div class="border rounded-xl overflow-hidden hover:shadow-lg">
      <!-- Image -->
      <div class="aspect-square bg-gray-50 p-4">
        <img :src="product.images?.[0]?.url" class="object-contain" />
      </div>

      <!-- Info -->
      <div class="p-4">
        <p class="text-xs text-gray-500">{{ product.brand?.name }}</p>
        <h3 class="font-medium line-clamp-2">{{ product.name }}</h3>

        <!-- Price -->
        <div v-if="hasDiscount">
          <p class="text-xs text-gray-400 line-through">{{ formatCLP(product.base_price) }}</p>
          <p class="text-lg font-bold text-primary-600">{{ formatCLP(product.sale_price) }}</p>
        </div>
        <div v-else>
          <p class="text-lg font-bold">{{ formatCLP(product.base_price) }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
```

### ProductGrid

```vue
<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
```

### ProductFilters

Propiedades:

```typescript
const props = defineProps<{
  brands: Brand[];
  selectedBrand: string;
  selectedCondition: string;
  minPrice?: number;
  maxPrice?: number;
  dynamicFilters?: FilterDefinition[];
  attrFilters?: Record<string, string>;
}>();
```

Eventos:

```typescript
const emit = defineEmits<{
  'update:brand': [value: string];
  'update:condition': [value: string];
  'update:min-price': [value: number | undefined];
  'update:max-price': [value: number | undefined];
  'update:attr-filters': [value: Record<string, string>];
}>();
```

### ProductSort

Opciones:

| Valor | Label |
|-------|-------|
| `newest` | Mas recientes |
| `price_asc` | Menor precio |
| `price_desc` | Mayor precio |
| `name_asc` | A-Z |

---

## Tipos

```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  short_description: string | null;
  base_price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  condition: string;  // "new" | "open_box" | "refurbished"
  brand: Brand | null;
  images: ProductImage[];
  categories?: Category[];
  tags?: Tag[];
  specs?: Record<string, string>;
  attribute_values?: ProductAttributeValue[];
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

interface FilterDefinition {
  attribute_id: number;
  name: string;
  slug: string;
  attribute_type: "text" | "number" | "select" | "boolean";
  unit: string | null;
  options: FilterOption[];
  min_value: number | null;
  max_value: number | null;
}

interface FilterOption {
  id: number;
  value: string;
  count: number;  // Cantidad de productos con este valor
}
```

---

## API Endpoints

### Productos

| Endpoint | Metodo | Query Params |
|----------|--------|--------------|
| `/products/` | GET | `search`, `category_slug`, `brand_slug`, `condition`, `min_price`, `max_price`, `sort`, `page`, `page_size`, `attr_*` |
| `/products/featured` | GET | - |
| `/products/new` | GET | - |
| `/products/{slug}` | GET | - |

### Categorias

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/categories/` | GET | Listado de categorias |
| `/categories/{slug}` | GET | Detalle de categoria |
| `/categories/{slug}/filters` | GET | Filtros dinamicos |

### Otros

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/brands/` | GET | Listado de marcas |
| `/banners/` | GET | Banners (query: `banner_type`) |
| `/offers/` | GET | Ofertas activas |
| `/campaigns/{slug}` | GET | Detalle de campana |

---

## SEO

### useHead Dinamico

```typescript
// En producto
useHead(() => ({
  title: product.value ? `${product.value.name} - ByteDigital` : "Producto - ByteDigital",
  meta: product.value?.meta_description
    ? [{ name: "description", content: product.value.meta_description }]
    : [],
}));

// En categoria
useHead(() => ({
  title: category.value ? `${category.value.name} - ByteDigital` : "Categoria - ByteDigital",
}));
```

### Configuracion Global

```typescript
// nuxt.config.ts
app: {
  head: {
    title: "ByteDigital - Tecnologia al mejor precio",
    meta: [
      { name: "description", content: "Tienda de tecnologia y computacion en Chile" },
    ],
    htmlAttrs: { lang: "es" },
  },
},
```
