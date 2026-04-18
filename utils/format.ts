export function formatCLP(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}

export function calcDiscount(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/**
 * El backend devuelve timestamps en UTC pero sin sufijo "Z". Este helper
 * agrega la Z cuando falta para que el parse respete la zona horaria.
 */
export function parseBackendDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const hasTz = /[zZ]|[+-]\d\d:\d\d$/.test(value);
  const d = new Date(hasTz ? value : `${value}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

