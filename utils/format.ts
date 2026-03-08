export function formatCLP(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}

export function calcDiscount(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}
