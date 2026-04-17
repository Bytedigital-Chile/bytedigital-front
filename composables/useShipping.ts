export interface ShippingQuote {
  comuna_id: number;
  comuna_name: string;
  price: number;
  is_deliverable: boolean;
  free_shipping_applied: boolean;
  threshold: number | null;
  delivery_hours_min: number | null;
  delivery_hours_max: number | null;
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
  ): Promise<ShippingQuote> {
    return await api<ShippingQuote>(
      `/geography/comunas/${comunaId}/shipping`,
      { params: { subtotal } },
    );
  }

  return { fetchRegions, fetchComunas, calculate };
}
