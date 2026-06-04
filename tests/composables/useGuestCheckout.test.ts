import { describe, it, expect } from "vitest";
import { useGuestCheckout } from "~/composables/useGuestCheckout";

describe("useGuestCheckout (cookie-backed, SSR-safe)", () => {
  it("starts inactive with empty email", () => {
    const { active, email } = useGuestCheckout();
    expect(active.value).toBe(false);
    expect(email.value).toBe("");
  });

  it("enable() activates guest mode (shared across calls via cookie)", () => {
    useGuestCheckout().enable();
    expect(useGuestCheckout().active.value).toBe(true);
  });

  it("setEmail persists and restoreEmail recovers it", () => {
    useGuestCheckout().setEmail("guest@test.cl");
    expect(useGuestCheckout().restoreEmail()).toBe("guest@test.cl");
  });

  it("reset clears active and email", () => {
    const g = useGuestCheckout();
    g.enable("guest@test.cl");
    g.setEmail("guest@test.cl");
    g.reset();
    expect(g.active.value).toBe(false);
    expect(g.email.value).toBe("");
  });
});
