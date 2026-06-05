// Guest-checkout state is backed by cookies (NOT useState) so it is shared
// between SSR and the client. With useState the server rendered isGuest=false
// while the client had it true, producing a hydration mismatch that left the
// inline address form unrendered. Cookies also keep guest mode across reloads.
export function useGuestCheckout() {
  const opts = { maxAge: 60 * 60 * 6, sameSite: "lax" as const, path: "/" };
  const active = useCookie<boolean>("bd_guest_checkout", { default: () => false, ...opts });
  const email = useCookie<string>("bd_guest_email", { default: () => "", ...opts });
  // Unguessable access key for the order (AL-1) — confirmation pages use this,
  // not the email, to fetch/track the guest order.
  const token = useCookie<string>("bd_guest_token", { default: () => "", ...opts });
  // Human-friendly tracking code (XXXX-XXXX), shown on the confirmation screen.
  const code = useCookie<string>("bd_guest_code", { default: () => "", ...opts });

  function enable(initialEmail = "") {
    active.value = true;
    if (initialEmail) email.value = initialEmail;
  }

  function setEmail(value: string) {
    email.value = value;
    // Also persist synchronously: the Flow flow leaves the SPA via
    // window.location, and Nuxt's cookie write (async watcher) may not flush
    // before navigation. localStorage.setItem is synchronous and survives the
    // external redirect, so the confirmation pages can recover it on return.
    if (import.meta.client && value) localStorage.setItem("bd_guest_email", value);
  }

  function setToken(value: string) {
    token.value = value;
    if (import.meta.client && value) localStorage.setItem("bd_guest_token", value);
  }

  function setCode(value: string) {
    code.value = value;
    if (import.meta.client && value) localStorage.setItem("bd_guest_code", value);
  }

  function restoreCode(): string {
    if (code.value) return code.value;
    if (import.meta.client) {
      const stored = localStorage.getItem("bd_guest_code") || "";
      if (stored) code.value = stored;
      return stored;
    }
    return "";
  }

  function restoreEmail(): string {
    if (email.value) return email.value;
    if (import.meta.client) {
      const stored = localStorage.getItem("bd_guest_email") || "";
      if (stored) email.value = stored;
      return stored;
    }
    return "";
  }

  // Order access token persisted at checkout, recovered by confirmation pages.
  function restoreToken(): string {
    if (token.value) return token.value;
    if (import.meta.client) {
      const stored = localStorage.getItem("bd_guest_token") || "";
      if (stored) token.value = stored;
      return stored;
    }
    return "";
  }

  function reset() {
    active.value = false;
    email.value = "";
    token.value = "";
    code.value = "";
    if (import.meta.client) {
      localStorage.removeItem("bd_guest_email");
      localStorage.removeItem("bd_guest_token");
      localStorage.removeItem("bd_guest_code");
    }
  }

  return { active, email, token, code, enable, setEmail, setToken, setCode, restoreEmail, restoreToken, restoreCode, reset };
}
