import { describe, it, expect, vi, beforeEach } from "vitest";
import { useApi } from "~/composables/useApi";

describe("useApi", () => {
  beforeEach(() => {
    // Ensure a fresh $fetch.create mock for each test
    (globalThis as any).$fetch = {
      create: vi.fn((opts: any) => {
        const fn = vi.fn();
        (fn as any)._baseURL = opts.baseURL;
        return fn;
      }),
    };
  });

  it("returns an api function", () => {
    const { api } = useApi();
    expect(typeof api).toBe("function");
  });

  it("creates $fetch with the correct baseURL from runtime config", () => {
    useApi();
    expect((globalThis as any).$fetch.create).toHaveBeenCalledWith({
      baseURL: "http://localhost:8000",
    });
  });

  it("uses the public.apiBase value from runtime config", () => {
    // Override runtime config for this test
    const original = (globalThis as any).useRuntimeConfig;
    (globalThis as any).useRuntimeConfig = () => ({
      public: { apiBase: "https://custom-api.example.com" },
    });

    useApi();

    expect((globalThis as any).$fetch.create).toHaveBeenCalledWith({
      baseURL: "https://custom-api.example.com",
    });

    // Restore
    (globalThis as any).useRuntimeConfig = original;
  });
});
