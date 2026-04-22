export interface ShippingQuote {
  comuna_id: number;
  comuna_name: string;
  price: number;
  is_deliverable: boolean;
  free_shipping_applied: boolean;
  threshold: number | null;
  delivery_hours_min: number | null;
  delivery_hours_max: number | null;
  rural_surcharge_applied?: boolean;
}

export interface RegionItem {
  id: number;
  name: string;
  ordinal?: number;
}

export interface ComunaItem {
  id: number;
  name: string;
  region_id: number;
}

export interface ShippingItemInput {
  product_id: number;
  quantity: number;
}

export function useShipping() {
  const { api } = useApi();

  async function fetchRegions(): Promise<RegionItem[]> {
    return await api<RegionItem[]>("/geography/regions");
  }

  async function fetchComunas(regionId: number): Promise<ComunaItem[]> {
    return await api<ComunaItem[]>(`/geography/regions/${regionId}/comunas`);
  }

  async function calculate(
    comunaId: number,
    subtotal: number = 0,
    items: ShippingItemInput[] | undefined = undefined,
  ): Promise<ShippingQuote> {
    if (items && items.length > 0) {
      return await api<ShippingQuote>(
        `/geography/comunas/${comunaId}/shipping-quote`,
        { method: "POST", body: { subtotal, items } },
      );
    }
    return await api<ShippingQuote>(
      `/geography/comunas/${comunaId}/shipping`,
      { params: { subtotal } },
    );
  }

  return { fetchRegions, fetchComunas, calculate };
}
