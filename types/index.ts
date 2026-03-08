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
  product: Product;
  quantity: number;
}
