import { describe, it, expect } from "vitest";
import { formatCLP, calcDiscount } from "~/utils/format";

describe("formatCLP", () => {
  it("formats a simple integer amount with Chilean peso sign", () => {
    const result = formatCLP(1000);
    // Locale-formatted, so the result should contain "$" and "1.000" or "1,000"
    // depending on the locale implementation
    expect(result).toContain("$");
    expect(result).toContain("1");
  });

  it("formats zero", () => {
    expect(formatCLP(0)).toBe("$0");
  });

  it("formats large numbers with locale separators", () => {
    const result = formatCLP(1500000);
    expect(result).toMatch(/^\$/);
    // Should contain the digits of 1500000
    expect(result.replace(/\D/g, "")).toBe("1500000");
  });

  it("returns a string starting with $", () => {
    expect(formatCLP(999)).toMatch(/^\$/);
  });
});

describe("calcDiscount", () => {
  it("calculates correct discount percentage", () => {
    // Original 100, sale 80 => 20% discount
    expect(calcDiscount(100, 80)).toBe(20);
  });

  it("returns 0 when original is 0", () => {
    expect(calcDiscount(0, 50)).toBe(0);
  });

  it("returns 0 when original is negative", () => {
    expect(calcDiscount(-10, 5)).toBe(0);
  });

  it("calculates 100% discount when sale is 0", () => {
    expect(calcDiscount(200, 0)).toBe(100);
  });

  it("rounds to nearest integer", () => {
    // 200 -> 150: ((200-150)/200)*100 = 25
    expect(calcDiscount(200, 150)).toBe(25);
    // 100 -> 33: ((100-33)/100)*100 = 67
    expect(calcDiscount(100, 33)).toBe(67);
  });

  it("handles fractional prices", () => {
    // 99.99 -> 79.99: ((99.99-79.99)/99.99)*100 = ~20.002
    expect(calcDiscount(99.99, 79.99)).toBe(20);
  });

  it("calculates 50% discount correctly", () => {
    expect(calcDiscount(500, 250)).toBe(50);
  });
});
