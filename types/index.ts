export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  parent_id: number | null;
  children: Category[];
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  position: number;
  is_primary: boolean;
}

export interface AttributeOption {
  id: number;
  value: string;
  position: number;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  attribute_type: "text" | "number" | "select" | "boolean";
  unit: string | null;
  is_filterable: boolean;
  position: number;
  options: AttributeOption[];
}

export interface ProductAttributeValue {
  id: number;
  attribute_id: number;
  attribute: Attribute;
  option: AttributeOption | null;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
}

export interface Product {
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
  condition: string;
  brand: Brand | null;
  images: ProductImage[];
  categories?: Category[];
  tags?: Tag[];
  specs?: Record<string, string>;
  attribute_values?: ProductAttributeValue[];
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string | null;
  position: number;
  is_active: boolean;
  banner_type: string;
  start_date: string | null;
  end_date: string | null;
}

export interface Campaign {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  products: Product[];
}

export interface Offer {
  id: number;
  product_id: number;
  discount_percentage: number | null;
  discount_price: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  is_flash: boolean;
  product: Product;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
  unit_price?: number;
}

export interface CustomerUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  avatar_url: string | null;
  google_linked: boolean;
}

export interface CustomerAddress {
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

export interface BillingProfile {
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

export interface Region {
  id: number;
  name: string;
  ordinal: number;
}

export interface ComunaOption {
  id: number;
  name: string;
}

export interface BankOption {
  id: number;
  name: string;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string | null;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
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

export interface PaymentGatewayPublic {
  slug: string;
  name: string;
  logo_url: string | null;
}

// Filter types for dynamic category filters
export interface FilterOption {
  id: number;
  value: string;
  count: number;
}

export interface FilterDefinition {
  attribute_id: number;
  name: string;
  slug: string;
  attribute_type: "text" | "number" | "select" | "boolean";
  unit: string | null;
  options: FilterOption[];
  min_value: number | null;
  max_value: number | null;
}

export interface CategoryFilters {
  filters: FilterDefinition[];
}
