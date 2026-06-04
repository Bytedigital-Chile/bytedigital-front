import { describe, it, expect, beforeEach } from "vitest";
import { useGuestCheckout } from "~/composables/useGuestCheckout";

describe("useGuestCheckout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts inactive with empty email", () => {
    const { active, email } = useGuestCheckout();
    expect(active.value).toBe(false);
    expect(email.value).toBe("");
  });

  it("enable() activates guest mode", () => {
    const { active, enable } = useGuestCheckout();
    enable();
    expect(active.value).toBe(true);
  });

  it("setEmail persists to localStorage and restoreEmail recovers it", () => {
    const { setEmail, restoreEmail } = useGuestCheckout();
    setEmail("guest@test.cl");
    expect(localStorage.getItem("bytedigital_guest_email")).toBe("guest@test.cl");
    expect(restoreEmail()).toBe("guest@test.cl");
  });

  it("reset clears active, email and storage", () => {
    const { enable, setEmail, reset, active, email } = useGuestCheckout();
    enable("guest@test.cl");
    setEmail("guest@test.cl");
    reset();
    expect(active.value).toBe(false);
    expect(email.value).toBe("");
    expect(localStorage.getItem("bytedigital_guest_email")).toBeNull();
  });
});
