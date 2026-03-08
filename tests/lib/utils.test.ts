import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn (class name utility)", () => {
  it("merges multiple class name strings", () => {
    const result = cn("px-4", "py-2", "text-sm");
    expect(result).toBe("px-4 py-2 text-sm");
  });

  it("handles a single class string", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles conditional classes (falsy values)", () => {
    const isActive = false;
    const result = cn("base-class", isActive && "active-class", "another");
    expect(result).toBe("base-class another");
  });

  it("handles conditional classes (truthy values)", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("handles undefined and null values", () => {
    const result = cn("valid", undefined, null, "also-valid");
    expect(result).toBe("valid also-valid");
  });

  it("resolves Tailwind conflicts by keeping the last conflicting class", () => {
    // px-4 and px-2 conflict -- twMerge should keep px-2 (last wins)
    const result = cn("px-4", "px-2");
    expect(result).toBe("px-2");
  });

  it("resolves conflicting text colors", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("resolves conflicting padding values", () => {
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("keeps non-conflicting classes from both inputs", () => {
    const result = cn("px-4 py-2 bg-white", "text-black font-bold");
    expect(result).toBe("px-4 py-2 bg-white text-black font-bold");
  });

  it("handles array inputs via clsx", () => {
    const result = cn(["px-4", "py-2"], "text-sm");
    expect(result).toBe("px-4 py-2 text-sm");
  });

  it("handles object inputs via clsx", () => {
    const result = cn({ "px-4": true, "py-2": false, "text-sm": true });
    expect(result).toBe("px-4 text-sm");
  });

  it("handles mixed inputs (strings, arrays, objects)", () => {
    const result = cn(
      "base",
      ["array-class"],
      { "obj-true": true, "obj-false": false },
    );
    expect(result).toBe("base array-class obj-true");
  });
});
